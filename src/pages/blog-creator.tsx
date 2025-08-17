import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, X, Save, Eye } from "lucide-react";
import { navigate } from "wouter/use-browser-location";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface BlogPost {
  id?: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  image?: string;
  category?: string;
  form?: string;
}

// Helper function to convert plain text with line breaks to HTML paragraphs
const formatDescription = (text: string): string => {
  return text
    .split('\n')
    .filter(paragraph => paragraph.trim() !== '')
    .map(paragraph => `<p>${paragraph.trim()}</p>`)
    .join('');
};

// Helper function to convert HTML paragraphs back to plain text
const htmlToPlainText = (html: string): string => {
  return html
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '\n')
    .trim();
};

export default function BlogEditor() {
  const [formData, setFormData] = useState<BlogPost>({
    title: "",
    description: "",
    image: "",
    category: "games",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isPreview, setIsPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const { user } = useSelector((state: RootState) => state.user);
  const id = user?._id;

  // Validate form whenever formData changes
  useEffect(() => {
    const validateForm = (): boolean => {
      const newErrors: FormErrors = {};

      if (!formData.title.trim()) {
        newErrors.title = "Title is required";
      } else if (formData.title.length > 100) {
        newErrors.title = "Title must be less than 100 characters";
      }

      if (!formData.description.trim()) {
        newErrors.description = "Content is required";
      } else if (formData.description.length < 50) {
        newErrors.description = "Content must be at least 50 characters";
      }

      if (!formData.image && !imageFile) {
        newErrors.image = "Please upload an image or provide an image URL";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    setIsFormValid(validateForm());
  }, [formData, imageFile]);  

    const submitImage = async (file: File): Promise<string> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ;
    const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET ;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);
    data.append("cloud_name", cloudName);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "post",
          body: data,
        }
      );
      if (!res.ok) throw new Error("Image upload failed");
      const newData = await res.json();
      return newData.url;
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors(prev => ({ ...prev, image: "Please upload a valid image file" }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: "Image must be smaller than 5MB" }));
      return;
    }

    setImageFile(file);
    setErrors(prev => ({ ...prev, image: "" }));
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    setIsLoading(true);
    setErrors(prev => ({ ...prev, form: "" }));

    try {
      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await submitImage(imageFile);
      }

      // Format the description before saving
      const formattedDescription = formatDescription(formData.description);

      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          description: formattedDescription,
          image: imageUrl,
          user_id: id,
          user_name: user?.username || "Anonymous",
        }),      
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create blog post");
      }

      navigate('/blog');
    } catch (error) {
      console.error("Blog creation error:", error);
      setErrors(prev => ({
        ...prev,
        form: error instanceof Error ? error.message : "An unexpected error occurred"
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    
    if (url && !url.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)) {
      setErrors(prev => ({ ...prev, image: "Please enter a valid image URL" }));
    } else {
      setErrors(prev => ({ ...prev, image: "" }));
    }
    
    setImagePreview(url);
    setFormData(prev => ({ ...prev, image: url }));
    setImageFile(null);
  };

  const handleFieldChange = (field: keyof BlogPost, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Preview component to show formatted content
  const PreviewContent = () => (
    <div className="prose max-w-none">
      <h1>{formData.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: formatDescription(formData.description) }} />
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.form && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md">
            {errors.form}
          </div>
        )}

        {isPreview ? (
          <PreviewContent />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>New Blog Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Cover Image *</Label>
                {imagePreview ? (
                  <div className="relative group">
                    <div className="aspect-video relative rounded-md overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setImageFile(null);
                        setFormData(prev => ({ ...prev, image: "" }));
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="mx-auto mb-4 text-muted-foreground" size={48} />
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Upload Image
                      </Button>
                      <div className="flex-1 space-y-1">
                        <Input
                          placeholder="Or enter image URL"
                          onChange={handleImageUrlChange}
                          value={formData.image}
                          className={errors.image ? "border-red-500" : ""}
                        />
                        {errors.image && (
                          <p className="text-red-500 text-xs text-left">{errors.image}</p>
                        )}
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={e => handleFieldChange('title', e.target.value)}
                    placeholder="Enter post title"
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Game Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleFieldChange('category', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a game" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="games">General Games</SelectItem>
                      <SelectItem value="pubg">PUBG</SelectItem>
                      <SelectItem value="freefire">Free Fire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.description}
                    onChange={e => handleFieldChange('description', e.target.value)}
                    placeholder="Write your content here..."
                    rows={10}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs">{errors.description}</p>
                  )}
                  <p className="text-muted-foreground text-xs">
                    {formData.description.length} characters (minimum 50 required)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
          >
            <Eye className="mr-2" size={16} />
            {isPreview ? "Continue Editing" : "Preview"}
          </Button>
          <Button 
            type="submit" 
            disabled={!isFormValid || isLoading}
          >
            <Save className="mr-2" size={16} />
            {isLoading ? "Publishing..." : "Publish Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}