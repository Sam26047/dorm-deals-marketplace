
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { listingService, categories, conditions } from '@/services/data.service';
import { Listing, Category, Condition } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from 'sonner';
import { Upload, ArrowLeft } from 'lucide-react';

const EditListing = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category>('other');
  const [condition, setCondition] = useState<Condition>('good');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to edit listings');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch listing
  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await listingService.getById(id);
        
        if (!data) {
          setError('Listing not found');
          return;
        }
        
        // Check if current user is the owner
        if (currentUser && data.sellerId !== currentUser.id) {
          setError('You do not have permission to edit this listing');
          return;
        }
        
        setListing(data);
        setTitle(data.title);
        setDescription(data.description);
        setPrice(String(data.price));
        setCategory(data.category);
        setCondition(data.condition);
        setImageUrl(data.imageUrl);
        setImagePreview(data.imageUrl);
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('Failed to load listing. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, currentUser]);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, image: 'Image size must be less than 5MB' });
      return;
    }
    
    // Check file type
    if (!file.type.match('image.*')) {
      setErrors({ ...errors, image: 'File must be an image' });
      return;
    }
    
    // Clear previous errors
    const newErrors = { ...errors };
    delete newErrors.image;
    setErrors(newErrors);
    
    setImageFile(file);
    
    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    
    if (!imageFile && !imageUrl) {
      newErrors.image = 'Please upload an image or provide an image URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !listing || !id) return;
    
    try {
      setIsSubmitting(true);
      
      // In a real app, we would upload the image to a storage service
      // and get back a URL. For this demo, we'll either use the provided URL
      // or a placeholder for the uploaded image
      const finalImageUrl = imageUrl || 
        (imageFile ? URL.createObjectURL(imageFile) : listing.imageUrl);
      
      const updatedListing = await listingService.update(id, {
        title,
        description,
        price: Number(price),
        category,
        condition,
        imageUrl: finalImageUrl,
      });
      
      toast.success('Listing updated successfully!');
      navigate(`/listing/${id}`);
    } catch (err) {
      console.error('Error updating listing:', err);
      toast.error('Failed to update listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <LoadingSpinner size="large" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p>{error || 'Listing not found'}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 inline-flex items-center text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Go back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-primary hover:underline inline-flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
        </div>
        
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Edit Listing</h1>
          
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                placeholder="e.g., iPhone 12 Pro in excellent condition"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>
            
            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                rows={5}
                className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe your item in detail. Include relevant information like brand, model, specifications, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
            
            {/* Price */}
            <div className="mb-4">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                id="price"
                min="0"
                step="0.01"
                className={`input-field ${errors.price ? 'border-red-500' : ''}`}
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>
            
            {/* Category & Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  className="input-field"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                  Condition
                </label>
                <select
                  id="condition"
                  className="input-field"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as Condition)}
                >
                  {conditions.map((cond) => (
                    <option key={cond.value} value={cond.value}>
                      {cond.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-40 cursor-pointer hover:border-primary transition-colors ${
                      errors.image ? 'border-red-500' : 'border-gray-300'
                    }`}
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload a new image</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF (max 5MB)</p>
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                  
                  <div className="mt-2">
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Or, provide image URL
                    </label>
                    <input
                      type="url"
                      id="imageUrl"
                      className="input-field"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>
                  
                  {errors.image && (
                    <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                  )}
                </div>
                
                {/* Image Preview */}
                <div className="flex items-center justify-center h-40 bg-gray-100 rounded-lg overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <p className="text-sm text-gray-500">No image selected</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                className="w-full btn-primary py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? <LoadingSpinner size="small" /> : 'Update Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EditListing;
