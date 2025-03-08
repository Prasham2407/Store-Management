import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import { 
  ColDef, 
  GridReadyEvent,
  RowDragEndEvent,
  ClientSideRowModelModule,
  ModuleRegistry,
  CellEditingStoppedEvent,
  GridApi
} from 'ag-grid-community';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { Store } from '../types/Store';
import { 
  fetchStores, 
  addStore, 
  updateStore, 
  deleteStore, 
  reorderStores 
} from '../redux/slices/storeSlice';
import { RootState, AppDispatch } from '../redux/store';

// Import AG Grid styles
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Register required modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const StorePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stores, loading, error } = useSelector((state: RootState) => state.store);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStore, setNewStore] = useState<Omit<Store, 'id'>>({
    storeCode: '',
    name: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    dispatch(fetchStores());
  }, [dispatch]);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  };

  const ActionCellRenderer = (params: any) => {
    return (
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => handleDelete(params.data.id)}
          className="text-red-600 hover:text-red-800 p-1 hover:bg-red-100 rounded"
          title="Delete Store"
        >
          <FaTrash />
        </button>
      </div>
    );
  };

  const columnDefs = useMemo<ColDef[]>(() => [
    {
      field: 'id',
      headerName: '#',
      width: 80,
      sort: 'asc',
      rowDrag: true,
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'storeCode',
      headerName: 'Store Code',
      editable: true,
      width: 130,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    },
    {
      field: 'name',
      headerName: 'Name',
      editable: true,
      flex: 1,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    },
    {
      field: 'city',
      headerName: 'City',
      editable: true,
      width: 150,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    },
    {
      field: 'state',
      headerName: 'State',
      editable: true,
      width: 100,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    },
    {
      headerName: 'Actions',
      width: 100,
      cellRenderer: ActionCellRenderer,
      sortable: false,
      filter: false,
      editable: false,
      resizable: false,
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
  }), []);

  const onCellEditingStopped = useCallback((event: CellEditingStoppedEvent) => {
    const { data } = event;
    if (data) {
      dispatch(updateStore({ id: data.id, updates: data }));
    }
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      dispatch(deleteStore(id));
    }
  };

  const handleAdd = () => {
    if (!newStore.storeCode || !newStore.name || !newStore.city || !newStore.state) {
      alert('Please fill in all fields');
      return;
    }
    dispatch(addStore(newStore));
    setShowAddForm(false);
    setNewStore({ storeCode: '', name: '', city: '', state: '' });
    fetchStores();
  };

  const onRowDragEnd = (event: RowDragEndEvent) => {
    if (!gridApi) return;
    
    const newStores: Store[] = [];
    gridApi.forEachNode((node) => {
      if (node.data) {
        newStores.push(node.data);
      }
    });
    
    dispatch(reorderStores(newStores));
  };

  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Store Management</h1>
            <p className="text-gray-600 mt-1">Manage your stores and locations</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 transition-colors"
          >
            <FaPlus size={14} />
            Add Store
          </button>
        </div>

        {showAddForm && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Store</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Code</label>
                <input
                  placeholder="Enter store code"
                  value={newStore.storeCode}
                  onChange={e => setNewStore({ ...newStore, storeCode: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                <input
                  placeholder="Enter store name"
                  value={newStore.name}
                  onChange={e => setNewStore({ ...newStore, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  placeholder="Enter city"
                  value={newStore.city}
                  onChange={e => setNewStore({ ...newStore, city: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  placeholder="Enter state"
                  value={newStore.state}
                  onChange={e => setNewStore({ ...newStore, state: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save Store
              </button>
            </div>
          </div>
        )}

        <div className="ag-theme-alpine w-full h-[600px] rounded-lg overflow-hidden border border-gray-200">
          <AgGridReact
            rowData={stores}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            animateRows={true}
            rowDragManaged={true}
            onGridReady={onGridReady}
            onRowDragEnd={onRowDragEnd}
            onCellEditingStopped={onCellEditingStopped}
            suppressMoveWhenRowDragging={true}
            enableRangeSelection={true}
            rowSelection="multiple"
            pagination={true}
            paginationPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default StorePage;
