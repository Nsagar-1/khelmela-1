import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Calendar } from 'lucide-react';
import DOMPurify from 'dompurify';

interface BlogPost {
  _id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  user_name: string;
  createdAt: string;
  category?: string;
  readTime?: string;
}

const HTMLRenderer = ({ content, className = '' }: { content: string; className?: string }) => {
  // Check if content already contains HTML tags
  const hasHTML = /<[a-z][\s\S]*>/i.test(content);
  
  // Format content based on whether it contains HTML
  const formattedContent = hasHTML
    ? content
    : content
        .split('\n')
        .filter(para => para.trim() !== '')
        .map(para => `<p>${para.trim()}</p>`)
        .join('');

  // Sanitize the HTML content
  const cleanHTML = DOMPurify.sanitize(formattedContent, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'h2', 'h3', 'h4'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    FORBID_ATTR: ['style', 'onclick']
  });

  return (
    <div 
      className={`html-content ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanHTML }} 
    />
  );
};

export default function BlogPostPage() {
  const path = window.location.pathname;
  const id = path.split('/').pop();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError("No blog post ID provided");
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/blogs/${id}`);
        if (!response.ok) throw new Error('Failed to fetch post');
        
        const data = await response.json();
        setPost({
          _id: data._id,
          title: data.title || 'Untitled Post',
          description: data.description || '',
          content: data.content || '',
          image: data.image || '/placeholder.svg',
          user_name: data.user_name || 'Anonymous',
          createdAt: data.createdAt || new Date().toISOString(),
          category: data.category,
          readTime: data.readTime
        });
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error instanceof Error ? error.message : "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
        <Button onClick={() => navigate('/blog')}>
          Back to Blog
        </Button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
        <Button onClick={() => navigate('/blog')}>
          Back to Blog
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <header className="bg-gray-200 border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Button variant="default" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Link to="/blog">
            <Button variant="default">
              View All Posts
            </Button>
          </Link>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-white">
      <h1 className="text-center text-1x sm:text-2xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight ">
            {post.title}
          </h1>
          <div className="relative rounded-xl overflow-hidden mb-8 shadow-lg w-[700px] h-[300px] mx-auto">
        
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          {post.category && (
            <Badge className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1">
              {post.category}
            </Badge>
          )}
        </div>

        <header className="mb-8">
          
          
          <HTMLRenderer 
            content={post.description}
            className="text-lg sm:text-lg text-black mb-6"
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-medium">{post.user_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              {post.readTime && (
                <Badge variant="secondary">{post.readTime} read</Badge>
              )}
            </div>
          </div>
        </header>

        <article className="bg-white rounded-xl p-6 sm:p-8 shadow-sm">
          <HTMLRenderer 
            content={post.content}
            className="prose prose-lg max-w-none"
          />
        </article>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-gray-200 mt-8">
        <div className="flex justify-between">
          <Button variant="default" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous Page
          </Button>
          <Link to="/blog">
            <Button variant="default">
              Back to Blog
            </Button>
          </Link>
        </div>
      </footer>

      <style>{`
        .html-content p {
          margin-bottom: 1.25em;
          line-height: 1.6;
        }
        .html-content ul,
        .html-content ol {
          margin-bottom: 1.25em;
          padding-left: 1.5em;
        }
        .html-content li {
          margin-bottom: 0.5em;
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