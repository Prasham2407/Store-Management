import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  GridReadyEvent,
  ValueGetterParams,
  ValueFormatterParams,
  CellClassParams,
  CellValueChangedEvent,
} from 'ag-grid-community';
import { fetchPlanningData, updatePlanningData } from '../redux/slices/planningSlice';
import { fetchSkus } from '../redux/slices/skuSlice';
import { fetchStores } from '../redux/slices/storeSlice';
import { RootState, AppDispatch } from '../redux/store';

// Import AG Grid styles
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../styles/ag-grid-custom.css';

const PlanningPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { planningData, loading, error } = useSelector((state: RootState) => state.planning);
  const { skus } = useSelector((state: RootState) => state.sku);
  const { stores } = useSelector((state: RootState) => state.store);

  useEffect(() => {
    // Fetch all required data
    dispatch(fetchPlanningData());
    dispatch(fetchSkus());
    dispatch(fetchStores());
  }, [dispatch]);

  // Get unique weeks from planning data
  const weeks = useMemo(() => {
    const uniqueWeeks = Array.from(new Set(planningData.map(item => item.week)));
    return uniqueWeeks.sort();
  }, [planningData]);

  // Group weeks by months
  const monthGroups = useMemo(() => {
    const groups: { [key: string]: string[] } = {};
    weeks.forEach(week => {
      const weekNum = parseInt(week.substring(1));
      const month = Math.floor((weekNum - 1) / 4);
      const monthName = new Date(2024, month, 1).toLocaleString('default', { month: 'long' });
      const monthKey = `${monthName} 2024`;
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(week);
    });
    return groups;
  }, [weeks]);

  const getWeekData = useCallback((storeCode: string, skuCode: string, week: string) => {
    return planningData.find(
      item => item.storeCode === storeCode && item.skuCode === skuCode && item.week === week
    )?.salesUnits || 0;
  }, [planningData]);

  const getSku = useCallback((skuCode: string) => {
    return skus.find(sku => sku.skuCode === skuCode);
  }, [skus]);

  const calculateGmPercentage = useCallback((salesDollars: number, gmDollars: number) => {
    if (!salesDollars) return 0;
    return (gmDollars / salesDollars) * 100;
  }, []);

  const currencyFormatter = (params: ValueFormatterParams) => {
    if (typeof params.value !== 'number') return '';
    return `$ ${params.value.toFixed(2)}`;
  };

  const percentageFormatter = (params: ValueFormatterParams) => {
    if (typeof params.value !== 'number') return '';
    return `${params.value.toFixed(1)}%`;
  };

  const onCellValueChanged = useCallback((event: CellValueChangedEvent) => {
    const { data, colDef } = event;
    if (!colDef.field) return;

    const weekMatch = colDef.field.match(/^(W\d+)_units$/);
    if (!weekMatch) return;

    const week = weekMatch[1];
    const salesUnits = event.newValue;

    dispatch(updatePlanningData({
      storeCode: data.storeCode,
      skuCode: data.skuCode,
      week,
      salesUnits
    }));
  }, [dispatch]);

  const createWeekColumns = useCallback((weekNumber: string) => {
    const baseColDef = {
      width: 120,
      suppressMenu: true,
    };

    return [
      {
        ...baseColDef,
        field: `${weekNumber}_units`,
        headerName: 'Sales Units',
        editable: true,
        type: 'numericColumn',
        valueGetter: (params: ValueGetterParams) => {
          return getWeekData(params.data.storeCode, params.data.skuCode, weekNumber);
        },
      },
      {
        ...baseColDef,
        field: `${weekNumber}_sales`,
        headerName: 'Sales $',
        valueGetter: (params: ValueGetterParams) => {
          const units = getWeekData(params.data.storeCode, params.data.skuCode, weekNumber);
          const sku = getSku(params.data.skuCode);
          return units * (sku?.price || 0);
        },
        valueFormatter: currencyFormatter,
      },
      {
        ...baseColDef,
        field: `${weekNumber}_gm`,
        headerName: 'GM $',
        valueGetter: (params: ValueGetterParams) => {
          const units = getWeekData(params.data.storeCode, params.data.skuCode, weekNumber);
          const sku = getSku(params.data.skuCode);
          const salesDollars = units * (sku?.price || 0);
          const costDollars = units * (sku?.cost || 0);
          return salesDollars - costDollars;
        },
        valueFormatter: currencyFormatter,
      },
      {
        ...baseColDef,
        field: `${weekNumber}_gm_pct`,
        headerName: "GM %",
        valueGetter: (params: ValueGetterParams) => {
          const units = getWeekData(params.data.storeCode, params.data.skuCode, weekNumber);
          const sku = getSku(params.data.skuCode);
          const salesDollars = units * (sku?.price || 0);
          const costDollars = units * (sku?.cost || 0);
          const gmDollars = salesDollars - costDollars;
          const gmPercentage = calculateGmPercentage(salesDollars, gmDollars);
          console.log(`Week: ${weekNumber}, Store: ${params.data.storeCode}, SKU: ${params.data.skuCode}, GM%: ${gmPercentage}`);
  
          return gmPercentage;
        },
        valueFormatter: percentageFormatter,
        cellClassRules: {
          "gm-high": (params: CellClassParams) =>{
            console.log("CellClassRule GM %:", params.value);
            return params.value >= 40;
          },
          "gm-medium": (params: CellClassParams) => params.value >= 10 && params.value < 40,
          "gm-low": (params: CellClassParams) => params.value > 5 && params.value < 10,
          "gm-critical": (params: CellClassParams) => params.value <= 5,
        },        
      },
      // {
      //   ...baseColDef,
      //   field: `${weekNumber}_gm_pct`,
      //   headerName: 'GM %',
      //   cellClassRules: {
      //     'gm-critical': (params: CellClassParams) => params.value <= 5,
      //     'gm-low': (params: CellClassParams) => params.value > 5 && params.value < 10,
      //     'gm-medium': (params: CellClassParams) => params.value >= 10 && params.value < 40,
      //     'gm-high': (params: CellClassParams) => params.value >= 40
      //   },
      //   valueGetter: (params: ValueGetterParams) => {
      //     const units = getWeekData(params.data.storeCode, params.data.skuCode, weekNumber);
      //     const sku = getSku(params.data.skuCode);
      //     const salesDollars = units * (sku?.price || 0);
      //     const costDollars = units * (sku?.cost || 0);
      //     const gmDollars = salesDollars - costDollars;
      //     return calculateGmPercentage(salesDollars, gmDollars);
      //   },
      //   valueFormatter: percentageFormatter,
      // },
    ];
  }, [getWeekData, getSku, calculateGmPercentage]);

  const columnDefs = useMemo(() => {
    const baseColumns: ColDef[] = [
      { 
        field: 'storeCode', 
        headerName: 'Store', 
        width: 100, 
        pinned: 'left',
        filter: true,
      },
      { 
        field: 'skuCode', 
        headerName: 'SKU', 
        width: 100, 
        pinned: 'left',
        filter: true,
      },
    ];

    const weekColumns = Object.entries(monthGroups).map(([month, monthWeeks]) => ({
      headerName: month,
      children: monthWeeks.flatMap(week => createWeekColumns(week)),
    }));

    return [...baseColumns, ...weekColumns];
  }, [createWeekColumns, monthGroups]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
  }), []);

  const rowData = useMemo(() => {
    if (!stores.length || !skus.length) return [];
    const rows: any[] = [];
    stores.forEach(store => {
      skus.forEach(sku => {
        rows.push({
          storeCode: store?.storeCode,
          skuCode: sku?.skuCode,
        });
      });
    });
    return rows;
  }, [stores, skus]);

  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  return (
    <div className="h-screen bg-gray-100">
      <div className="p-6">
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="ag-theme-alpine" style={{ height: 'calc(100vh - 100px)', width: '100%' }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              animateRows={true}
              suppressColumnVirtualisation={false}
              enableRangeSelection={true}
              suppressRowClickSelection={true}
              headerHeight={48}
              rowHeight={48}
              onCellValueChanged={onCellValueChanged}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanningPage; 