import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, PlusCircle } from 'lucide-react';

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
          className="rounded-[1.35rem] border border-border-light bg-surface-light p-5 transition hover:shadow-sm dark:border-border-dark dark:bg-surface-dark"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-text-main-light dark:text-text-main-dark truncate">{exp.title}</h4>
              <p className="mt-0.5 text-sm text-text-sub-light dark:text-text-sub-dark">
                {exp.company} {exp.location && `• ${exp.location}`}
              </p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-text-sub-light/80 dark:text-text-sub-dark/80">
                {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
              </p>
              {exp.description && (
                <p className="mt-3 text-sm leading-relaxed text-text-main-light/90 dark:text-text-main-dark/90 text-wrap whitespace-pre-line">
                  {exp.description}
                </p>
              )}
            </div>
            <div className="ml-4 flex gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleEdit(index)}
                className="rounded-lg p-2 text-text-sub-light transition hover:bg-primary/10 hover:text-primary dark:text-text-sub-dark dark:hover:bg-primary/20"
                title="Edit"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="rounded-lg p-2 text-text-sub-light transition hover:bg-red-500/10 hover:text-red-600 dark:text-text-sub-dark dark:hover:bg-red-500/20 dark:hover:text-red-400"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <AnimatePresence mode="wait" initial={false}>
        {editingIndex !== null ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="rounded-[1.5rem] border border-border-light bg-surface-light p-5 sm:p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark space-y-5">
              <h4 className="mb-2 font-display text-lg font-semibold tracking-[-0.02em] text-text-main-light dark:text-text-main-dark">
                {editingIndex < experiences.length ? 'Edit Experience' : 'Add New Experience'}
              </h4>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-text-sub-light dark:text-text-sub-dark">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={currentExperience.title}
                    onChange={(e) => setCurrentExperience({ ...currentExperience, title: e.target.value })}
                    placeholder="e.g. Head Chef"
                    className="soft-input h-11"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-text-sub-light dark:text-text-sub-dark">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={currentExperience.company}
                    onChange={(e) => setCurrentExperience({ ...currentExperience, company: e.target.value })}
                    placeholder="e.g. The French Bistro"
                    className="soft-input h-11"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-text-sub-light dark:text-text-sub-dark">
                    Location
                  </label>
                  <input
                    type="text"
                    value={currentExperience.location}
                    onChange={(e) => setCurrentExperience({ ...currentExperience, location: e.target.value })}
                    placeholder="e.g. New York, NY"
                    className="soft-input h-11"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-text-sub-light dark:text-text-sub-dark">
                    Start Date *
                  </label>
                  <input
                    type="month"
                    value={currentExperience.startDate}
                    onChange={(e) => setCurrentExperience({ ...currentExperience, startDate: e.target.value })}
                    className="soft-input h-11"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-text-sub-light dark:text-text-sub-dark">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={currentExperience.endDate}
                    onChange={(e) => setCurrentExperience({ ...currentExperience, endDate: e.target.value })}
                    disabled={currentExperience.current}
                    className="soft-input h-11 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="flex items-center pt-8">
                  <input
                    type="checkbox"
                    id="current"
                    checked={currentExperience.current}
                    onChange={(e) => setCurrentExperience({ ...currentExperience, current: e.target.checked, endDate: e.target.checked ? '' : currentExperience.endDate })}
                    className="h-5 w-5 rounded border-border-light text-primary focus:ring-primary dark:border-border-dark dark:bg-white/10 dark:checked:bg-primary accent-primary"
                  />
                  <label htmlFor="current" className="ml-3 text-sm font-medium text-text-main-light dark:text-text-main-dark cursor-pointer select-none">
                    I currently work here
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-text-sub-light dark:text-text-sub-dark">
                  Description
                </label>
                <textarea
                  value={currentExperience.description}
                  onChange={(e) => setCurrentExperience({ ...currentExperience, description: e.target.value })}
                  placeholder="Describe your responsibilities and achievements..."
                  rows={4}
                  className="soft-input resize-y"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-border-light/50 pt-5 dark:border-border-dark/50">
                <Button
                  onClick={handleCancel}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  type="button"
                  disabled={!currentExperience.title || !currentExperience.company || !currentExperience.startDate}
                >
                  Save Experience
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="button"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <button
              type="button"
              onClick={handleAdd}
              className="flex w-full items-center justify-center gap-2 rounded-[1.35rem] border-2 border-dashed border-border-light bg-white/50 p-5 text-sm font-semibold text-text-sub-light transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:text-primary dark:border-border-dark dark:bg-white/5 dark:text-text-sub-dark dark:hover:border-primary/40 dark:hover:bg-primary/10 dark:hover:text-primary"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Add New Experience</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
