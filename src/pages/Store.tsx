import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { addStore, removeStore, reorderStores } from "../redux/storeSlice";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Store: React.FC = () => {
  const stores = useSelector((state: RootState) => state?.store?.stores);
  const dispatch = useDispatch();
  const [newStore, setNewStore] = useState({ name: "", city: "", state: "" });

  const handleAddStore = () => {
    if (newStore.name && newStore.city && newStore.state) {
      dispatch(addStore({ id: Date.now(), ...newStore }));
      setNewStore({ name: "", city: "", state: "" });
    }
  };

  const handleRemove = (id: number) => {
    dispatch(removeStore(id));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(stores);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    dispatch(reorderStores(items));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Store Management</h2>

      {/* Add Store Form */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Store Name"
          value={newStore.name}
          onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="City"
          value={newStore.city}
          onChange={(e) => setNewStore({ ...newStore, city: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="State"
          value={newStore.state}
          onChange={(e) => setNewStore({ ...newStore, state: e.target.value })}
          className="border p-2 rounded"
        />
        <button onClick={handleAddStore} className="bg-orange-500 text-white px-4 py-2 rounded">
          New Store
        </button>
      </div>

      {/* Store Table with Drag & Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="stores">
          {(provided) => (
            <table {...provided.droppableProps} ref={provided.innerRef} className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">Store</th>
                  <th className="p-2 border">City</th>
                  <th className="p-2 border">State</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stores?.map((store, index) => (
                  <Draggable key={store.id} draggableId={store.id.toString()} index={index}>
                    {(provided) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="border"
                      >
                        <td className="p-2">{store.id}</td>
                        <td className="p-2">{store.name}</td>
                        <td className="p-2">{store.city}</td>
                        <td className="p-2">{store.state}</td>
                        <td className="p-2">
                          <button onClick={() => handleRemove(store.id)} className="text-red-500">
                            🗑 Delete
                          </button>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Store;
