import { Switch, Route } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import BlogCreator from "@/pages/blog-creator";
import Blog from "@/pages/blog";
import Profile from "@/pages/profile";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import BlogPostPage from "@/pages/blog-page"; 
import BlogEditPage from "@/pages/blog-edit";

function Router() {
  const { user } = useSelector((state: RootState) => state.user);
  const role = user?.admin;
  const token = user?.token;

  // return (
  //     <Switch>
  //       <Route path="/" component={Home} />
  //       <Route path="/login" component={Login} />
  //       <Route path="/blog" component={Blog} />
  //       <Route path="/blog-creator" component={BlogCreator} />
  //       <Route path="/signup" component={Signup} />
  //       <Route path="/profile" component={Profile} />
  //       <Route component={NotFound} />
  //     </Switch>
  //   );
  // Proper React components with return statements
  const AdminRoutes = () => {
    return (
      <Switch>
        <Route path="/" component={Home} />
        {/* <Route path="/login" component={Login} /> */}
        <Route path="/blog" component={Blog} />
        <Route path="/blog-creator" component={BlogCreator} />
        <Route path="/signup" component={Signup} />
        <Route path="/profile" component={Profile} />    
        <Route path="/blog-page/:id" component={BlogPostPage} />
        <Route path="/edit-blog/:id" component={BlogEditPage} />
        <Route component={NotFound} />
      </Switch>
    );
  };

  const UserRoutes = () => {
    return (
      <Switch>
        <Route path="/" component={Home} />
        {/* <Route path="/login" component={Login} /> */}
        <Route path="/blog" component={Blog} />
        <Route path="/blog-creator" component={BlogCreator} />
        <Route path="/profile" component={Profile} />
        <Route path="/blog-page/:id" component={BlogPostPage} />

        <Route component={NotFound} />
      </Switch>
    );
  };

  const VisitorRoutes = () => {
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog-page" component={Blog}/>
        <Route path="/blog-page/:id" component={BlogPostPage} />
        <Route component={NotFound} />
      </Switch>
    );
  };

  // Conditional rendering
  if (role === 'admin' && token) return <AdminRoutes />;
  if (role === 'user' && token) return <UserRoutes />;
  return <VisitorRoutes />;
}

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Router />
      </main>
      <Footer />
    </div>
  );
}

export default App;