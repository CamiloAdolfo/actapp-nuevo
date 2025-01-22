import ActaForm from './components/ActaForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-2">Generador de Actas</h1>
        <h2 className="text-xl text-center text-indigo-600 mb-8">SisteCam Ver. 3.0 (Beta)</h2>
        <div className="bg-white shadow-xl rounded-lg p-6">
          <ActaForm />
        </div>
      </div>
    </main>
  )
}

