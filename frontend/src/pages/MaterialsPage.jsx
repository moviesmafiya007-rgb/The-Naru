import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MaterialsPage = () => {
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [materialsRes, subjectsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/materials`, { headers }),
          axios.get(`${process.env.REACT_APP_API_URL}/subjects`, { headers }),
        ]);

        setMaterials(materialsRes.data.data);
        setSubjects(subjectsRes.data.data);
      } catch (error) {
        console.error('Error fetching materials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredMaterials = selectedSubject
    ? materials.filter(m => m.subject_id === parseInt(selectedSubject))
    : materials;

  const getMaterialIcon = (type) => {
    switch (type) {
      case 'video':
        return '🎥';
      case 'pdf':
        return '📄';
      case 'note':
        return '📝';
      case 'document':
        return '📋';
      default:
        return '📚';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">📚 Study Materials</h1>

        {/* Filter */}
        <div className="mb-8">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* Materials List */}
        {filteredMaterials.length > 0 ? (
          <div className="space-y-4">
            {filteredMaterials.map(material => (
              <div key={material.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{getMaterialIcon(material.material_type)}</span>
                    <h3 className="text-xl font-bold text-gray-800">{material.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-3">{material.description}</p>
                  <div className="flex gap-6 text-sm text-gray-600">
                    <span>👁️ Views: {material.views_count}</span>
                    <span>⬇️ Downloads: {material.downloads_count}</span>
                    {material.duration_minutes && <span>⏱️ Duration: {material.duration_minutes} min</span>}
                  </div>
                </div>
                <button className="ml-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium whitespace-nowrap">
                  Access
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No materials available for the selected subject.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsPage;