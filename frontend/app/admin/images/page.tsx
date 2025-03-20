'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';

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
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/login');
    },
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    file: null as File | null,
  });
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.token) {
      fetchCategories();
    }
  }, [status, session]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/admin/images/categories`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${session?.user?.token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('אנא התחבר כמנהל כדי לצפות בתוכן זה');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const categoriesArray = Array.isArray(data) ? data : [];
      setCategories(categoriesArray);
      if (categoriesArray.length > 0 && !selectedCategory) {
        setSelectedCategory(categoriesArray[0].id);
      }
      setError(null);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('שגיאה בטעינת הקטגוריות');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/admin/images/categories`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${session?.user?.token}`
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('אנא התחבר כמנהל כדי לבצע פעולה זו');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      toast.success('הקטגוריה נוצרה בהצלחה');
      setIsAddingCategory(false);
      setNewCategory({ name: '', description: '' });
      fetchCategories();
    } catch (error) {
      console.error('Failed to add category:', error);
      toast.error('שגיאה בהוספת קטגוריה');
    } finally {
      setLoading(false);
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
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/admin/images/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.user?.token}`
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('אנא התחבר כמנהל כדי לבצע פעולה זו');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      toast.success('התמונה הועלתה בהצלחה');
      setUploadData({ title: '', description: '', file: null });
      fetchCategories();
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('שגיאה בהעלאת התמונה');
    } finally {
      setLoading(false);
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
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/admin/images/reorder`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${session?.user?.token}`
        },
        body: JSON.stringify({ images: updatedImages }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('אנא התחבר כמנהל כדי לבצע פעולה זו');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      toast.success('סדר התמונות עודכן בהצלחה');
      fetchCategories();
    } catch (error) {
      console.error('Failed to update image order:', error);
      toast.error('שגיאה בעדכון סדר התמונות');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק תמונה זו?')) return;

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/admin/images/${imageId}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.user?.token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('אנא התחבר כמנהל כדי לבצע פעולה זו');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      toast.success('התמונה נמחקה בהצלחה');
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast.error('שגיאה במחיקת התמונה');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק קטגוריה זו? כל התמונות בקטגוריה יימחקו!')) return;

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/admin/images/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.user?.token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('אנא התחבר כמנהל כדי לבצע פעולה זו');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      toast.success('הקטגוריה נמחקה בהצלחה');
      setSelectedCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error('שגיאה במחיקת הקטגוריה');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="p-8 text-center text-gray-500">טוען...</div>;
  }

  if (!session?.user?.token) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">אנא התחבר מחדש</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1E6B87] mb-6">ניהול תמונות</h1>
        
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <button
            onClick={() => setIsAddingCategory(true)}
            className="bg-[#1E6B87] text-white px-6 py-2 rounded-lg hover:bg-[#154C61] transition-colors duration-200 disabled:opacity-50"
            disabled={loading}
          >
            הוספת קטגוריה חדשה
          </button>
          
          {categories.length > 0 ? (
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6B87] focus:border-transparent"
              disabled={loading}
            >
              <option value="">בחר קטגוריה</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-500">אין קטגוריות זמינות</p>
          )}
        </div>
      </div>

      {isAddingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-6 text-[#1E6B87]">הוספת קטגוריה חדשה</h2>
            <form onSubmit={handleAddCategory} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">שם הקטגוריה</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6B87] focus:border-transparent"
                  required
                  dir="rtl"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6B87] focus:border-transparent"
                  dir="rtl"
                  disabled={loading}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  disabled={loading}
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1E6B87] text-white rounded-lg hover:bg-[#154C61] transition-colors duration-200 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'שומר...' : 'שמירה'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedCategory && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-[#1E6B87] mb-6">העלאת תמונה חדשה</h3>
            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">כותרת</label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6B87] focus:border-transparent"
                  required
                  dir="rtl"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6B87] focus:border-transparent"
                  dir="rtl"
                  disabled={loading}
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תמונה</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6B87] focus:border-transparent"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full px-6 py-2 bg-[#1E6B87] text-white rounded-lg hover:bg-[#154C61] transition-colors duration-200 disabled:opacity-50"
                  disabled={!uploadData.file || !selectedCategory || loading}
                >
                  {loading ? 'מעלה...' : 'העלאה'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-[#1E6B87] mb-6">תמונות בקטגוריה</h3>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="images">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                            >
                              <img
                                src={image.url}
                                alt={image.title}
                                className="w-full h-48 object-cover"
                              />
                              <div className="p-4">
                                <h4 className="font-semibold text-[#1E6B87] mb-2">{image.title}</h4>
                                {image.description && (
                                  <p className="text-gray-600 text-sm mb-4">
                                    {image.description}
                                  </p>
                                )}
                                <button
                                  onClick={() => handleDeleteImage(image.id)}
                                  className="text-red-500 hover:text-red-600 transition-colors duration-200 disabled:opacity-50"
                                  disabled={loading}
                                >
                                  מחק תמונה
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-bold text-[#1E6B87] mb-4">קטגוריות</h3>
        <div className="flex flex-wrap gap-4">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              <button
                className={`px-6 py-2 rounded-lg transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-[#1E6B87] text-white'
                    : 'bg-white text-[#1E6B87] border border-[#1E6B87] hover:bg-[#E6EEF2]'
                }`}
                onClick={() => setSelectedCategory(category.id)}
                disabled={loading}
              >
                {category.name}
              </button>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="text-red-500 hover:text-red-600 transition-colors duration-200 p-2 disabled:opacity-50"
                title="מחק קטגוריה"
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
