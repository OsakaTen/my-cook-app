import Header from "@/components/Header";
import Footer from "@/components/Footer";

const LoadingScreen = () => (
  <div>
    <Header />
    <main className="px-10 mt-20 sm:px-16 md:px-24 lg:px-40 py-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">レシピを検索中...</p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default LoadingScreen;
