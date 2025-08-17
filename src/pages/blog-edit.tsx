import { useState, useEffect, useRef } from "react";
import { navigate } from "wouter/use-browser-location";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface BlogPost {
  _id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  category: string;
  user_id: string;
  user_name: string;
  createdAt: string;
}

export default function EditBlogPage() {
  const path = window.location.pathname;
  const id = path.split('/').pop();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [post, setPost] = useState<BlogPost>({
    _id: "",
    title: "",
    description: "",
    content: "",
    image: "",
    category: "",
    user_id: "",
    user_name: "",
    createdAt: ""
  });
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/blogs/${id}`);
        if (!response.ok) throw new Error("Failed to fetch post");
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const submitImage = async (file: File) => {
    setImageUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'test_khel');
      data.append('cloud_name', 'dur5g9bjk');

      const res = await fetch('https://api.cloudinary.com/v1_1/dur5g9bjk/image/upload', {
        method: 'post',
        body: data
      });
      if (!res.ok) throw new Error("Image upload failed");
      const newData = await res.json();
      return newData.url;
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    try {
      const imageUrl = await submitImage(e.target.files[0]);
      setPost({ ...post, image: imageUrl });
    } catch (err) {
      setError("Failed to upload image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update post");
      }

      navigate(`/blog-page/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update post");
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="space-y-2">
          <Label>Featured Image</Label>
          <div className="flex items-center gap-4">
            {post.image ? (
              <div className="relative group">
                <img
                  src={post.image}
                  alt="Current post"
                  className="w-32 h-32 object-cover rounded-md"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white"
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                  >
                    Change
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="w-32 h-32 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer bg-gray-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <div className="flex-1">
              <Button
                variant="outline"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={imageUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {imageUploading ? "Uploading..." : post.image ? "Change Image" : "Upload Image"}
              </Button>
              <p className="mt-1 text-sm text-gray-500">
                {imageUploading ? "Uploading your image..." : "JPG, PNG "}
              </p>
            </div>
          </div>
        </div>

        {/* Title Input */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={post.title}
            onChange={(e) => setPost({...post, title: e.target.value})}
            placeholder="Post title"
            required
          />
        </div>

        {/* Game Category Select */}
        <div className="space-y-2">
          <Label>Game Category</Label>
          <Select
            value={post.category}
            onValueChange={(value) => setPost({...post, category: value})}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a game" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="games">General Games</SelectItem>
              <SelectItem value="pubg">PUBG</SelectItem>
              <SelectItem value="freefire">Free Fire</SelectItem>
              {/* <SelectItem value="valorant">Valorant</SelectItem>
              <SelectItem value="cod">Call of Duty</SelectItem> */}
            </SelectContent>
          </Select>
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={post.description}
            onChange={(e) => setPost({...post, description: e.target.value})}
            placeholder="Short description"
            rows={10}
            required
          />
        </div>

        {/* Content Input */}
        {/* <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={post.content}
            onChange={(e) => setPost({...post, content: e.target.value})}
            placeholder="Post content"
            rows={6}
          />
        </div> */}

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate(`/blog-page/${id}`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={imageUploading}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}