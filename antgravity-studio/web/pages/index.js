import Layout from '../components/Layout';
import HeroSection from '../components/home/HeroSection';
import FeaturesGrid from '../components/home/FeaturesGrid';
import CTASection from '../components/home/CTASection';

export default function Home() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <HeroSection />
        <FeaturesGrid />
        <CTASection />
      </div>
    </Layout>
  );
}
