import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AnimatedSection } from '../hooks/useScrollAnimation';
import { FaCalendar, FaUser, FaEye, FaArrowLeft, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaTag } from 'react-icons/fa';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`/blogs/${slug}`);
      setBlog(res.data);
      
      // Fetch related posts from same category
      if (res.data.category) {
        const relatedRes = await axios.get(`/blogs?category=${res.data.category}&limit=3`);
        const related = Array.isArray(relatedRes.data) ? relatedRes.data : [];
        setRelatedPosts(related.filter(p => p._id !== res.data._id).slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = window.location.href;
  const shareTitle = blog?.title || '';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog Post Not Found</h1>
        <Link to="/blog" className="text-primary hover:text-secondary">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero Image */}
      {blog.featuredImage && (
        <div className="relative h-[50vh] min-h-[400px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${blog.featuredImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>
        </div>
      )}

      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <AnimatedSection animation="fade-in">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-8"
            >
              <FaArrowLeft className="text-sm" />
              Back to Blog
            </Link>
          </AnimatedSection>

          {/* Article Header */}
          <AnimatedSection animation="fade-in-up" className="bg-white rounded-2xl shadow-sm overflow-hidden -mt-20 relative z-10 mb-8">
            {/* Cover Image */}
            {blog.featuredImage && (
              <div className="w-full aspect-[21/9] overflow-hidden">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-8 md:p-12">
              <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                {blog.category}
              </span>

              <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 pb-6 border-b border-gray-100">
                <span className="flex items-center gap-2">
                  <FaUser className="text-primary" />
                  {blog.author?.name || 'Admin'}
                </span>
                <span className="flex items-center gap-2">
                  <FaCalendar className="text-primary" />
                  {formatDate(blog.createdAt)}
                </span>
                <span className="flex items-center gap-2">
                  <FaEye className="text-primary" />
                  {blog.views || 0} views
                </span>
              </div>

              {/* Excerpt */}
              <p className="mt-6 text-lg text-gray-600 leading-relaxed italic border-l-4 border-primary pl-4">
                {blog.excerpt}
              </p>
            </div>
          </AnimatedSection>

          {/* Article Content */}
          <AnimatedSection animation="fade-in-up" delay={100} className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-8">
            <div 
              className="prose prose-lg max-w-none
                prose-headings:font-serif prose-headings:text-gray-900
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900
                prose-ul:text-gray-600 prose-ol:text-gray-600
                prose-img:rounded-xl prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-2">
                  <FaTag className="text-gray-400" />
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-4">Share this article:</p>
              <div className="flex gap-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <FaFacebook />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors"
                >
                  <FaTwitter />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors"
                >
                  <FaLinkedin />
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>
          </AnimatedSection>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <AnimatedSection animation="fade-in-up" delay={200}>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <Link
                    key={post._id}
                    to={`/blog/${post.slug}`}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.featuredImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-2">{formatDate(post.createdAt)}</p>
                      <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </AnimatedSection>
          )}

          {/* CTA */}
          <AnimatedSection animation="fade-in-up" delay={300} className="mt-12 bg-primary rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Let our experts help you navigate the real estate market and find the perfect investment opportunity.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/projects"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Browse Projects
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
