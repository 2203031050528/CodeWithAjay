import { useEffect, useState } from 'react';
import API from '../api/axios';
import { HiAcademicCap, HiDownload, HiExternalLink } from 'react-icons/hi';

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const { data } = await API.get('/certificates/my-certificates');
        setCertificates(data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchCerts();
  }, []);

  const downloadCertificate = async (certId) => {
    try {
      const response = await API.get(`/certificates/download/${certId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CodeWithAjay_Certificate_${certId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) { console.error('Download failed:', err); }
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full animate-spin" style={{ borderWidth: '3px', borderStyle: 'solid', borderColor: '#6366f1', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-2">
        <HiAcademicCap className="text-primary-400" /> My Certificates
      </h1>
      <p className="text-slate-400 text-sm mb-8">Your achievements and course completions</p>

      {certificates.length === 0 ? (
        <div className="text-center py-20">
          <HiAcademicCap className="text-5xl text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No certificates yet</p>
          <p className="text-slate-500 text-sm mt-1">Complete a course to earn your first certificate!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert._id} className="glass-card p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                <HiAcademicCap className="text-[80px] text-indigo-400" />
              </div>
              <div className="mb-4">
                <p className="text-xs text-indigo-400 font-mono mb-1">{cert.certificateId}</p>
                <h3 className="text-base font-semibold text-white">{cert.courseName}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Completed {new Date(cert.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => downloadCertificate(cert.certificateId)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', color: '#fff' }}>
                  <HiDownload /> Download PDF
                </button>
                <a href={`/verify/${cert.certificateId}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center px-3 py-2 rounded-lg text-xs no-underline transition-all"
                  style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', color: '#a5b4fc' }}>
                  <HiExternalLink />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;
