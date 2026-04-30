import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { AnimatedSection } from '../hooks/useScrollAnimation';
import { FaCalendar, FaUser, FaEye, FaSearch, FaArrowRight, FaPlay, FaYoutube } from 'react-icons/fa';
import { cldUrl } from '../utils/cloudinary';

const Blog = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategory = searchParams.get('category') || '';
  const [playingId, setPlayingId] = useState(null);

  const getYoutubeId = (url) => {
    const match = url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match?.[1] || null;
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
    fetchRecentPosts();
  }, [activeCategory]);

  const fetchBlogs = async (search = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory) params.append('category', activeCategory);
      if (search.trim()) params.append('search', search.trim());
      
      const res = await axios.get(`/blogs?${params.toString()}`);
      setBlogs(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/blogs/categories');
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchRecentPosts = async () => {
    try {
      const res = await axios.get('/blogs/recent');
      setRecentPosts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBlogs(searchQuery);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <div className="container-custom text-center">
          <AnimatedSection animation="fade-in-up">
            <span className="text-white/60 text-xs tracking-[0.3em] uppercase font-semibold">
              Our Blog
            </span>
            <h1 className="mt-3 text-4xl md:text-5xl font-serif font-bold">
              Real Estate Insights
            </h1>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
              Expert advice, market updates, and investment tips to help you make informed property decisions
            </p>
          </AnimatedSection>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Blog Posts */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No blog posts found</p>
              </div>
            ) : (
              <div className="space-y-8">
                {blogs.map((blog, index) => (
                  <AnimatedSection key={blog._id} animation="fade-in-up" delay={index * 100}>
                    <article
                      onClick={() => navigate(`/blog/${blog.slug}`)}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <div className="md:flex">
                        {(() => {
                          const videoId = blog.youtubeUrl ? getYoutubeId(blog.youtubeUrl) : null;
                          if (videoId && playingId === blog._id) {
                            return (
                              <div className="md:w-1/3 aspect-video md:aspect-auto">
                                <iframe
                                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                  title={blog.title}
                                  allow="autoplay; encrypted-media; picture-in-picture"
                                  allowFullScreen
                                  className="w-full h-full min-h-[200px]"
                                />
                              </div>
                            );
                          }
                          if (videoId) {
                            return (
                              <div className="md:w-1/3">
                                <button
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setPlayingId(blog._id);
                                  }}
                                  className="relative w-full block overflow-hidden aspect-[4/3] md:aspect-auto md:h-full group"
                                >
                                  <img
                                    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                    alt={blog.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                    decoding="async"
                                  />
                                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                                    <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                      <FaPlay className="text-white text-lg ml-1" />
                                    </div>
                                  </div>
                                </button>
                              </div>
                            );
                          }
                          return (
                            <div className="md:w-1/3">
                              <Link to={`/blog/${blog.slug}`}>
                                <div className="aspect-[4/3] md:aspect-auto md:h-full overflow-hidden">
                                  <img
                                    src={cldUrl(blog.featuredImage, { w: 600 }) || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'}
                                    alt={blog.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                    decoding="async"
                                  />
                                </div>
                              </Link>
                            </div>
                          );
                        })()}
                        <div className="md:w-2/3 p-6">
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                              {blog.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaCalendar className="text-xs" />
                              {formatDate(blog.createdAt)}
                            </span>
                          </div>
                          <Link
                            to={`/blog/${blog.slug}`}
                            onClick={(event) => event.stopPropagation()}
                          >
                            <h2 className="text-xl font-serif font-bold text-gray-900 hover:text-primary transition-colors mb-3">
                              {blog.title}
                            </h2>
                          </Link>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {blog.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <FaUser className="text-xs" />
                                {blog.author?.name || 'Admin'}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaEye className="text-xs" />
                                {blog.views || 0} views
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              {blog.youtubeUrl && (
                                <a
                                  href={blog.youtubeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(event) => event.stopPropagation()}
                                  className="text-red-600 font-medium text-sm flex items-center gap-1 hover:text-red-700"
                                >
                                  <FaYoutube /> YouTube
                                </a>
                              )}
                              <Link
                                to={`/blog/${blog.slug}`}
                                onClick={(event) => event.stopPropagation()}
                                className="text-primary font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all"
                              >
                                Read More <FaArrowRight className="text-xs" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Search */}
            <AnimatedSection animation="fade-in" className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Search</h3>
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                >
                  <FaSearch />
                </button>
              </form>
            </AnimatedSection>

            {/* Categories */}
            <AnimatedSection animation="fade-in" delay={100} className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setSearchParams({})}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      !activeCategory ? 'bg-primary text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    All Posts
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.name}>
                    <button
                      onClick={() => setSearchParams({ category: cat.name })}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between items-center ${
                        activeCategory === cat.name ? 'bg-primary text-white' : 'hover:bg-gray-100'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activeCategory === cat.name ? 'bg-white/20' : 'bg-gray-100'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            {/* Recent Posts */}
            <AnimatedSection animation="fade-in" delay={200} className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Posts</h3>
              <ul className="space-y-4">
                {recentPosts.map((post) => (
                  <li key={post._id}>
                    <Link to={`/blog/${post.slug}`} className="flex gap-3 group">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={cldUrl(post.featuredImage, { w: 150 }) || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150'}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
