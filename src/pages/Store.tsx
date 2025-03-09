import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GridReadyEvent,
  RowDragEndEvent,
  ClientSideRowModelModule,
  ModuleRegistry,
  CellEditingStoppedEvent,
  GridApi,
} from "ag-grid-community";
import { FaTrash, FaGripLines, FaEdit } from "react-icons/fa";
import { Store } from "../types/Store";
import {
  fetchStores,
  addStore,
  updateStore,
  deleteStore,
  reorderStores,
} from "../redux/slices/storeSlice";
import { RootState, AppDispatch } from "../redux/store";

// Import AG Grid styles
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../styles/ag-grid-custom.css";

// Register required modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const StorePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stores, loading, error } = useSelector(
    (state: RootState) => state.store
  );
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStore, setNewStore] = useState<Omit<Store, "id">>({
    storeCode: "",
    name: "",
    city: "",
    state: "",
  });
  const [editStore, setEditStore] = useState<{editId: number, isEdit: boolean}>({editId: 0, isEdit: false});
  const [isFetchCall, setIsFetchCall] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchStores());
  }, [dispatch]);

  useEffect(() => {
    if(isFetchCall){
    dispatch(fetchStores());
  setIsFetchCall(false)}
  }, [isFetchCall]);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  };

  const ActionCellRenderer = (params: any) => {
    return (
      <div className="flex flex-row gap-2 mt-3 text-xl">
        <div className="items-center">
          <FaEdit
            className="text-gray-400 hover:text-red-600 cursor-pointer"
            onClick={() => handleEditClick(params.data.id)}
            title="Edit Store"
          />
        </div>
        <div className="items-center">
          <FaTrash
            className="text-gray-400 hover:text-red-600 cursor-pointer"
            onClick={() => handleDelete(params.data.id)}
            title="Delete Store"
          />
        </div>
        <div className="items-center">
          <FaGripLines className="text-gray-400 cursor-move" />
        </div>
      </div>
    );
  };

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: "",
        field: "actions",
        width: 100,
        cellRenderer: ActionCellRenderer,
        sortable: false,
        filter: false,
        cellClass: "flex items-center",
      },
      {
        field: "id",
        headerName: "S.No",
        width: 100,
        sort: "asc",
        rowDrag: true,
      },
      {
        field: "name",
        headerName: "Store",
        flex: 1,
        editable: true,
      },
      {
        field: "city",
        headerName: "City",
        width: 150,
        editable: true,
      },
      {
        field: "state",
        headerName: "State",
        width: 120,
        editable: true,
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: false,
      resizable: false,
    }),
    []
  );

  const onCellEditingStopped = useCallback(
    (event: CellEditingStoppedEvent) => {
      const { data } = event;
      if (data) {
        dispatch(updateStore({ id: data.id, updates: data }));
      }
    },
    [dispatch]
  );

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      dispatch(deleteStore(id));
    }
  };

  const handleAdd = () => {
    if (!newStore.name || !newStore.city || !newStore.state) {
      alert("Please fill in all required fields");
      return;
    }
    dispatch(addStore(newStore));
    setShowAddForm(false);
    setNewStore({ storeCode: "", name: "", city: "", state: "" });
  };

  const handleEdit = () => {
    dispatch(updateStore({id: editStore.editId,updates: newStore}));
    setShowAddForm(false);
    setIsFetchCall(true);
    setEditStore({editId: 0, isEdit: false})
    setNewStore({ storeCode: "", name: "", city: "", state: "" });
  };

  const handleEditClick = (id: number) => {
    const selectedStoreDetail = stores.find((x) => x.id === id);
    setNewStore({
      storeCode: selectedStoreDetail?.storeCode ?? "",
      name: selectedStoreDetail?.name ?? "",
      city: selectedStoreDetail?.city ?? "",
      state: selectedStoreDetail?.state ?? "",
    });
    setEditStore({editId: id, isEdit: true});
    setShowAddForm(true);
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
    <div className="h-screen bg-gray-100">
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-coral-pink text-gray-800 px-6 py-2 rounded-lg text-sm font-medium uppercase tracking-wider shadow-sm hover:bg-opacity-90 transition-colors"
          >
            NEW STORE
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name
                </label>
                <input
                  placeholder="Enter store name"
                  value={newStore.name}
                  onChange={(e) =>
                    setNewStore({ ...newStore, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  placeholder="Enter city"
                  value={newStore.city}
                  onChange={(e) =>
                    setNewStore({ ...newStore, city: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  placeholder="Enter state"
                  value={newStore.state}
                  onChange={(e) =>
                    setNewStore({ ...newStore, state: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editStore.isEdit ? handleEdit : handleAdd}
                className="bg-coral-pink text-gray-800 px-4 py-2 rounded hover:bg-opacity-90"
              >
               { editStore.isEdit ? "Edit Store" : "Save Store"}
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg overflow-hidden">
          <div
            className="ag-theme-alpine"
            style={{ height: "calc(100vh - 200px)", width: "100%" }}
          >
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
              headerHeight={48}
              rowHeight={48}
              suppressCellFocus={true}
              suppressRowClickSelection={true}
              suppressLoadingOverlay={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
