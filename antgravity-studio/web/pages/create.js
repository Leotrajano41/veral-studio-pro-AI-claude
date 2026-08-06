import Layout from '../components/Layout';
import CreateVideoForm from '../components/forms/CreateVideoForm';

export default function Create() {
  const handleGenerate = async (data) => {
    await new Promise((r) => setTimeout(r, 1500));
    console.log('Video generation payload:', data);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-txt-primary">Criar Vídeo Automático</h1>
          <p className="text-sm text-txt-secondary">Preencha os parâmetros e deixe a IA fazer o resto</p>
        </div>
        <CreateVideoForm onGenerate={handleGenerate} />
      </div>
    </Layout>
  );
}
