import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { navigate } from 'wouter/use-browser-location';
import DOMPurify from 'dompurify';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  image: string;
  user_name: string;
  createdAt: string;
  category?: string;
}

const HTMLRenderer = ({ content, className = '' }: { 
  content: string; 
  className?: string;
}) => {
  const hasHTML = /<[a-z][\s\S]*>/i.test(content);
  
  const formattedContent = hasHTML
    ? content
    : content
        .split('\n')
        .filter(para => para.trim() !== '')
        .map(para => `<p>${para.trim()}</p>`)
        .join('');

  const cleanHTML = DOMPurify.sanitize(formattedContent, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    FORBID_ATTR: ['style', 'onclick']
  });

  return (
    <div 
      className={`html-content line-clamp-3 ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanHTML }} 
    />
  );
};

export default function BlogPage() {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    limit: 7,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(true);
  const role = user?.admin;

  const handleReadMore = (postId: string) => {
    navigate(`/blog-page/${postId}`);
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/blogs?page=${currentPage}&limit=7`);        const data = await response.json();
        
        if (data.success) {
          setPosts(data.blogs);
          setPagination({
            total: data.pagination.total,
            totalPages: data.pagination.totalPages,
            limit: data.pagination.limit,
            hasNextPage: data.pagination.hasNextPage,
            hasPrevPage: data.pagination.hasPrevPage
          });
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/blogs/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete post");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-semibold text-gray-900">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Gaming Blog</h1>
              <p className="text-lg text-gray-600">Discover insights, tutorials and latest gaming trends.</p>
            </div>
            {isLoggedIn && (
              <a href="/blog-creator">
                <Button className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                  Create Blog
                </Button>
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentPage === 1 && posts.length > 0 && (
          <section className="mb-16">
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="lg:flex">
                <div className="lg:w-1/2 h-96 flex items-center justify-center bg-gray-100">
                  <img
                    src={posts[0].image}
                    alt={posts[0].title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="lg:w-1/2 p-8">
                  {posts[0].category && (
                    <Badge className="mb-4 bg-blue-100 text-blue-800">{posts[0].category}</Badge>
                  )}
                  <h2 className="text-3xl font-bold text-white mb-4">{posts[0].title}</h2>
                  <HTMLRenderer 
                    content={posts[0].description} 
                    className="text-gray-600 mb-6 leading-relaxed"
                  />
                  <div className="flex items-center text-sm text-gray-500 mb-6">
                    <User className="w-5 h-5 mr-2 text-gray-400" />
                    <span className="mr-4">{posts[0].user_name}</span>
                    <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                    <span>{new Date(posts[0].createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-end items-center gap-3">
                    <Button 
                      onClick={() => handleReadMore(posts[0].id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Read More
                    </Button>
                    {role === 'admin' && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/edit-blog/${posts[0].id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(posts[0].id)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </section>
        )}

        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {currentPage === 1 ? 'Latest Posts' : `Page ${currentPage}`}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(currentPage === 1 ? posts.slice(1) : posts).map((post) => (
              <Card 
                key={post.id} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    {post.category && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {post.category}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl font-semibold text-white-900">
                    {post.title}
                  </CardTitle>
                  <CardDescription>
                    <HTMLRenderer 
                      content={post.description} 
                      className="text-gray-600"
                    />
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="mr-4">{post.user_name}</span>
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-end items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReadMore(post.id)}
                    >
                      Read More
                    </Button>
                    {role === 'admin' && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/edit-blog/${post.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-3">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="px-6"
            >
              Previous
            </Button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(number => (
              <Button
                key={number}
                variant={currentPage === number ? "default" : "outline"}
                onClick={() => handlePageChange(number)}
                className="w-12 h-12 rounded-full"
              >
                {number}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="px-6"
            >
              Next
            </Button>
          </div>
        )}
      </main>

      <style>{`
        .html-content {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }
        .html-content p {
          margin-bottom: 0.5em;
          line-height: 1.6;
        }
        .html-content br {
          content: "";
          display: block;
          margin-bottom: 0.5em;
        }
        .html-content ul,
        .html-content ol {
          margin-bottom: 0.5em;
          padding-left: 1.5em;
        }
        .html-content li {
          margin-bottom: 0.25em;
        }
        .html-content a {
          color: #3b82f6;
          text-decoration: underline;
        }
        .html-content a:hover {
          color: #2563eb;
        }
      `}</style>
    </div>
  );
}