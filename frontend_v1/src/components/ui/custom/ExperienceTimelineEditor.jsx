import { useState } from 'react';

export function ExperienceTimelineEditor({ experiences = [], onChange }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentExperience, setCurrentExperience] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  });

  const handleAdd = () => {
    setEditingIndex(experiences.length);
    setCurrentExperience({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    });
  };

  const handleSave = () => {
    const newExperiences = [...experiences];
    if (editingIndex !== null) {
      if (editingIndex < newExperiences.length) {
        newExperiences[editingIndex] = currentExperience;
      } else {
        newExperiences.push(currentExperience);
      }
      onChange(newExperiences);
      setEditingIndex(null);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setCurrentExperience(experiences[index]);
  };

  const handleDelete = (index) => {
    const newExperiences = experiences.filter((_, i) => i !== index);
    onChange(newExperiences);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-4">
      {experiences.map((exp, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">{exp.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {exp.company} {exp.location && `• ${exp.location}`}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
              </p>
              {exp.description && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{exp.description}</p>
              )}
            </div>
            <div className="flex gap-2 ml-4">
              <button
                type="button"
                onClick={() => handleEdit(index)}
                className="p-2 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {editingIndex !== null ? (
        <div className="rounded-lg border-2 border-primary bg-white p-6 dark:border-primary dark:bg-gray-800 space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            {editingIndex < experiences.length ? 'Edit Experience' : 'Add New Experience'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                value={currentExperience.title}
                onChange={(e) => setCurrentExperience({ ...currentExperience, title: e.target.value })}
                placeholder="e.g. Head Chef"
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company *
              </label>
              <input
                type="text"
                value={currentExperience.company}
                onChange={(e) => setCurrentExperience({ ...currentExperience, company: e.target.value })}
                placeholder="e.g. The French Bistro"
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={currentExperience.location}
                onChange={(e) => setCurrentExperience({ ...currentExperience, location: e.target.value })}
                placeholder="e.g. New York, NY"
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date *
              </label>
              <input
                type="month"
                value={currentExperience.startDate}
                onChange={(e) => setCurrentExperience({ ...currentExperience, startDate: e.target.value })}
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="month"
                value={currentExperience.endDate}
                onChange={(e) => setCurrentExperience({ ...currentExperience, endDate: e.target.value })}
                disabled={currentExperience.current}
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                id="current"
                checked={currentExperience.current}
                onChange={(e) => setCurrentExperience({ ...currentExperience, current: e.target.checked, endDate: e.target.checked ? '' : currentExperience.endDate })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
              />
              <label htmlFor="current" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                I currently work here
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={currentExperience.description}
              onChange={(e) => setCurrentExperience({ ...currentExperience, description: e.target.value })}
              placeholder="Describe your responsibilities and achievements..."
              rows={3}
              className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!currentExperience.title || !currentExperience.company || !currentExperience.startDate}
              className="px-4 py-2 text-sm font-bold text-gray-900 bg-primary rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save Experience
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white p-4 text-sm font-medium text-gray-600 hover:border-primary hover:text-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-primary dark:hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">add</span>
          <span>Add Experience</span>
        </button>
      )}
    </div>
  );
}
