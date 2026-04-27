import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import { HiCheckCircle, HiXCircle, HiAcademicCap } from 'react-icons/hi';

const CertificateVerify = () => {
  const { certId } = useParams();
  const [cert, setCert] = useState(null);
  const [verified, setVerified] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyCert = async () => {
      try {
        const { data } = await API.get(`/certificates/verify/${certId}`);
        setCert(data.data);
        setVerified(data.verified);
      } catch (err) {
        setVerified(false);
      } finally { setLoading(false); }
    };
    verifyCert();
  }, [certId]);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full animate-spin" style={{ borderWidth: '3px', borderStyle: 'solid', borderColor: '#6366f1', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="page-container flex items-center justify-center min-h-[60vh]">
      <div className="glass p-8 sm:p-10 max-w-md w-full text-center animate-slide-up">
        {verified ? (
          <>
            <HiCheckCircle className="text-5xl text-emerald-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-white mb-1">Certificate Verified ✅</h1>
            <p className="text-slate-400 text-sm mb-6">This certificate is authentic and issued by CodeWithAjay</p>
            <div className="text-left space-y-3 p-4 rounded-xl" style={{ background: 'rgba(15, 13, 26, 0.5)', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
              <div><p className="text-xs text-slate-500">Certificate ID</p><p className="text-sm text-indigo-400 font-mono">{cert.certificateId}</p></div>
              <div><p className="text-xs text-slate-500">Recipient</p><p className="text-sm text-white font-medium">{cert.userName}</p></div>
              <div><p className="text-xs text-slate-500">Course</p><p className="text-sm text-white">{cert.courseName}</p></div>
              <div><p className="text-xs text-slate-500">Completed On</p><p className="text-sm text-slate-300">{new Date(cert.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
            </div>
          </>
        ) : (
          <>
            <HiXCircle className="text-5xl text-red-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-white mb-1">Certificate Not Found</h1>
            <p className="text-slate-400 text-sm">The certificate ID <span className="font-mono text-indigo-400">{certId}</span> could not be verified.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default CertificateVerify;
