'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Image {
  id: number;
  title: string;
  description: string | null;
  url: string;
  displayOrder: number;
}

interface Category {
  id: number;
  name: string;
  description: string | null;
  images: Image[];
}

export default function ImagesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    file: null as File | null,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      setCategories(data);
      if (data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });
      if (response.ok) {
        setIsAddingCategory(false);
        setNewCategory({ name: '', description: '' });
        fetchCategories();
      }
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadData({ ...uploadData, file: e.target.files[0] });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.file || !selectedCategory) return;

    const formData = new FormData();
    formData.append('image', uploadData.file);
    formData.append('title', uploadData.title);
    formData.append('description', uploadData.description || '');
    formData.append('categoryId', selectedCategory.toString());

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        setUploadData({ title: '', description: '', file: null });
        fetchCategories();
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const category = categories.find(c => c.id === selectedCategory);
    if (!category) return;

    const newImages = Array.from(category.images);
    const [reorderedItem] = newImages.splice(result.source.index, 1);
    newImages.splice(result.destination.index, 0, reorderedItem);

    const updatedImages = newImages.map((img, index) => ({
      id: img.id,
      displayOrder: index,
    }));

    try {
      await fetch('/api/admin/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: updatedImages }),
      });
      fetchCategories();
    } catch (error) {
      console.error('Failed to update image order:', error);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק תמונה זו?')) return;

    try {
      await fetch(`/api/admin/images/${imageId}`, { method: 'DELETE' });
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsAddingCategory(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          הוספת קטגוריה חדשה
        </button>
        
        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(Number(e.target.value))}
          className="border rounded p-2"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {isAddingCategory && (
        <form onSubmit={handleAddCategory} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700">שם הקטגוריה</label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">תיאור</label>
            <textarea
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsAddingCategory(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              שמירה
            </button>
          </div>
        </form>
      )}

      <form onSubmit={handleUpload} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium">העלאת תמונה חדשה</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">כותרת</label>
          <input
            type="text"
            value={uploadData.title}
            onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">תיאור</label>
          <textarea
            value={uploadData.description}
            onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">תמונה</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={!uploadData.file}
        >
          העלאה
        </button>
      </form>

      {selectedCategory && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="images">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {categories
                  .find(c => c.id === selectedCategory)
                  ?.images.map((image, index) => (
                    <Draggable key={image.id} draggableId={image.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-4 rounded-lg shadow"
                        >
                          <img
                            src={image.url}
                            alt={image.title}
                            className="w-full h-48 object-cover rounded"
                          />
                          <h4 className="mt-2 font-medium">{image.title}</h4>
                          {image.description && (
                            <p className="text-gray-600 text-sm">{image.description}</p>
                          )}
                          <button
                            onClick={() => handleDeleteImage(image.id)}
                            className="mt-2 text-red-600 hover:text-red-800"
                          >
                            מחיקה
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}
