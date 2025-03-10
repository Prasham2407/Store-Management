import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import { 
  ColDef, 
  GridReadyEvent,
  ClientSideRowModelModule,
  ModuleRegistry,
  CellEditingStoppedEvent,
  GridApi,
  ValueFormatterParams
} from 'ag-grid-community';
import { FaTrash, FaGripLines, FaEdit } from 'react-icons/fa';
import { Sku } from '../types/Sku';
import { 
  fetchSkus, 
  addSku, 
  updateSku, 
  deleteSku, 
  reorderSkus 
} from '../redux/slices/skuSlice';
import { RootState, AppDispatch } from '../redux/store';

// Import AG Grid styles
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../styles/ag-grid-custom.css';

// Register required modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const SKUPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { skus, loading, error } = useSelector((state: RootState) => state.sku);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editSku, setEditSku] = useState<{editId: number, isEdit: boolean}>({editId: 0, isEdit: false});
  const [newSku, setNewSku] = useState<Omit<Sku, 'id'>>({
    skuCode: '',
    name: '',
    category: '',
    department: '',
    price: 0,
    cost: 0
  });

  useEffect(() => {
    dispatch(fetchSkus());
  }, [dispatch]);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  };

  const ActionCellRenderer = (params: any) => {
    return (
      <div className="flex gap-4 items-center mt-3 text-xl">
        <FaEdit
          className="text-gray-400 hover:text-red-600 cursor-pointer"
          onClick={() => handleEditClick(params.data.id)}
          title="Edit SKU"
        />
        <FaTrash
          className="text-gray-400 hover:text-red-600 cursor-pointer"
          onClick={() => handleDelete(params.data.id)}
          title="Delete SKU"
        />
        <FaGripLines className="text-gray-400 cursor-move" />
      </div>
    );
  };

  const currencyFormatter = (params: ValueFormatterParams) => {
    if (typeof params.value !== 'number') return '';
    return `$ ${params.value.toFixed(2)}`;
  };

  const columnDefs = useMemo<ColDef[]>(() => [
    {
      headerName: '',
      field: 'actions',
      width: 150,
      cellRenderer: ActionCellRenderer,
      sortable: false,
      filter: false,
      cellClass: 'flex items-center',
      suppressMovable: true,
      pinned: 'left'
    },
    {
      field: 'skuCode',
      headerName: 'SKU Code',
      width: 130,
      sort: 'asc',
      rowDrag: true,
      suppressMovable: true,
      pinned: 'left'
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 200,
      flex: 2,
      editable: true,
    },
    {
      field: 'category',
      headerName: 'Category',
      minWidth: 150,
      flex: 1,
      editable: true,
    },
    {
      field: 'department',
      headerName: 'Department',
      minWidth: 150,
      flex: 1,
      editable: true,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      editable: true,
      type: 'numericColumn',
      valueFormatter: currencyFormatter,
      cellClass: 'text-right'
    },
    {
      field: 'cost',
      headerName: 'Cost',
      width: 120,
      editable: true,
      type: 'numericColumn',
      valueFormatter: currencyFormatter,
      cellClass: 'text-right'
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    cellStyle: { display: 'flex', alignItems: 'center' }
  }), []);

  const gridOptions = useMemo(() => ({
    rowHeight: 48,
    headerHeight: 48,
    rowDragManaged: true,
    animateRows: true,
    suppressMoveWhenRowDragging: false
  }), []);

  const onCellEditingStopped = useCallback((event: CellEditingStoppedEvent) => {
    const { data } = event;
    if (data) {
      dispatch(updateSku({ id: data.id, updates: data }));
    }
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this SKU?')) {
      dispatch(deleteSku(id));
    }
  };

  const handleAdd = () => {
    if (!newSku.skuCode || !newSku.name || !newSku.category || !newSku.department) {
      alert('Please fill in all required fields');
      return;
    }
    dispatch(addSku(newSku));
    setShowAddForm(false);
    setNewSku({ skuCode: '', name: '', category: '', department: '', price: 0, cost: 0 });
  };

  const handleEdit = () => {
    const updatedSkuData = {
      skuCode: newSku.skuCode,
      name: newSku.name,
      category: newSku.category,
      department: newSku.department,
      price: Number(newSku.price),
      cost: Number(newSku.cost)
    };
    
    dispatch(updateSku({
      id: editSku.editId,
      updates: updatedSkuData
    }));
    
    setShowAddForm(false);
    setEditSku({editId: 0, isEdit: false});
    setNewSku({ skuCode: '', name: '', category: '', department: '', price: 0, cost: 0 });
  };

  const handleEditClick = (id: number) => {
    const selectedSkuDetail = skus.find((x) => x.id === id);
    if (selectedSkuDetail) {
      setNewSku({
        skuCode: selectedSkuDetail.skuCode,
        name: selectedSkuDetail.name,
        category: selectedSkuDetail.category,
        department: selectedSkuDetail.department,
        price: selectedSkuDetail.price,
        cost: selectedSkuDetail.cost
      });
      setEditSku({editId: id, isEdit: true});
      setShowAddForm(true);
    }
  };

  const onRowDragEnd = () => {
    if (!gridApi) return;
    
    const newSkus: Sku[] = [];
    gridApi.forEachNode((node) => {
      if (node.data) {
        newSkus.push(node.data);
      }
    });
    
    dispatch(reorderSkus(newSkus));
  };

  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (loading) return <div className="p-4">Loading SKUs...</div>;

  return (
    <div className="h-screen bg-gray-100">
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-coral-pink text-gray-800 px-6 py-2 rounded-lg text-sm font-medium uppercase tracking-wider shadow-sm hover:bg-opacity-90 transition-colors"
          >
            {editSku.isEdit ? 'EDIT SKU' : 'NEW SKU'}
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU Code</label>
                <input
                  placeholder="Enter SKU code"
                  value={newSku.skuCode}
                  onChange={e => setNewSku({ ...newSku, skuCode: e.target.value })}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  placeholder="Enter name"
                  value={newSku.name}
                  onChange={e => setNewSku({ ...newSku, name: e.target.value })}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  placeholder="Enter category"
                  value={newSku.category}
                  onChange={e => setNewSku({ ...newSku, category: e.target.value })}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  placeholder="Enter department"
                  value={newSku.department}
                  onChange={e => setNewSku({ ...newSku, department: e.target.value })}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  placeholder="Enter price"
                  value={newSku.price}
                  onChange={e => setNewSku({ ...newSku, price: parseFloat(e.target.value) })}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                <input
                  type="number"
                  placeholder="Enter cost"
                  value={newSku.cost}
                  onChange={e => setNewSku({ ...newSku, cost: parseFloat(e.target.value) })}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditSku({editId: 0, isEdit: false});
                  setNewSku({ skuCode: '', name: '', category: '', department: '', price: 0, cost: 0 });
                }}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editSku.isEdit ? handleEdit : handleAdd}
                className="bg-coral-pink text-gray-800 px-4 py-2 rounded hover:bg-opacity-90"
              >
                {editSku.isEdit ? 'Edit SKU' : 'Save SKU'}
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg overflow-hidden">
          <div className="ag-theme-alpine" style={{ height: 'calc(100vh - 200px)', width: '100%' }}>
            <AgGridReact
              rowData={skus}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              gridOptions={gridOptions}
              onGridReady={onGridReady}
              animateRows={true}
              rowDragManaged={true}
              suppressMoveWhenRowDragging={false}
              onRowDragEnd={onRowDragEnd}
              onCellEditingStopped={onCellEditingStopped}
              suppressRowClickSelection={true}
              enableRangeSelection={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SKUPage;