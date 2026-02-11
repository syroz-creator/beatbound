
import React, { useState, useEffect } from 'react';
import { ChevronLeft, User, Mail, Phone, ShieldCheck, Gamepad2, Trophy, Flame, LogOut, ChevronRight, CheckCircle2, AlertCircle, Copy, ExternalLink, Check, ShieldAlert, HelpCircle } from 'lucide-react';
import { ProgressState, UserProfile } from '../types';
import { GOOGLE_CLIENT_ID } from '../constants';

interface ProfileViewProps {
  progress: ProgressState;
  onBack: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ progress, onBack }) => {
  const [phone, setPhone] = useState('');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState(true); // Keep it visible for the user

  // Clean origin - absolutely no trailing slash for Google Console
  const currentOrigin = window.location.origin.replace(/\/$/, "");

  // Load user from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('rg_user_profile');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Initialize REAL Google Sign In
  useEffect(() => {
    if (user) return; 

    const handleCredentialResponse = (response: any) => {
      setIsLoggingIn(true);
      try {
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decoded = JSON.parse(jsonPayload);
        const newUser = {
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture
        };
        
        setUser(newUser);
        localStorage.setItem('rg_user_profile', JSON.stringify(newUser));
      } catch (err) {
        console.error("Token decoding failed", err);
      } finally {
        setIsLoggingIn(false);
      }
    };

    const initGsi = () => {
      const isPlaceholder = !GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes("YOUR_GOOGLE_CLIENT_ID_HERE");
      if ((window as any).google && !isPlaceholder) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false
          });

          const btnContainer = document.getElementById("googleBtnContainer");
          if (btnContainer) {
            (window as any).google.accounts.id.renderButton(
              btnContainer,
              { theme: "outline", size: "large", width: "100%", shape: "rectangular" }
            );
          }
        } catch (e) {
          console.error("Google GSI Error:", e);
        }
      }
    };

    const timer = setTimeout(initGsi, 500);
    return () => clearTimeout(timer);
  }, [user]);

  const copyOrigin = () => {
    navigator.clipboard.writeText(currentOrigin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rg_user_profile');
  };

  const handlePhoneVerify = () => {
    setIsVerifyingPhone(true);
    setTimeout(() => setIsVerifyingPhone(false), 2000);
  };

  const isConfigured = GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.includes("YOUR_GOOGLE_CLIENT_ID_HERE");

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0510] overflow-y-auto font-['Space_Grotesk']">
      {/* Header */}
      <div className="flex items-center gap-4 p-8 relative z-20">
        <button onClick={onBack} className="p-3 bg-purple-900/40 rounded-full border border-purple-500/20 hover:bg-purple-800 transition-all text-white">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter glow-purple">Profile</h2>
      </div>

      <div className="max-w-xl mx-auto w-full px-8 pb-20 space-y-10">
        {/* User Card */}
        <div className="bg-purple-900/10 border border-purple-500/20 rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-3xl rounded-full -mr-10 -mt-10"></div>
          
          <div className="w-24 h-24 bg-gradient-purple rounded-full p-1 mb-6 shadow-2xl shadow-purple-600/30">
            <div className="w-full h-full bg-[#0a0510] rounded-full flex items-center justify-center overflow-hidden">
              {user?.picture ? (
                <img src={user.picture} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-purple-400" />
              )}
            </div>
          </div>
          
          <h3 className="text-2xl font-black text-white tracking-widest uppercase truncate max-w-full">
            {user?.name || "Player One"}
          </h3>
          <p className="text-purple-400 font-bold text-[10px] tracking-[0.4em] uppercase mt-1">
            {user?.email || "Guest Account"}
          </p>
        </div>

        {/* Auth Section */}
        {!user ? (
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em] ml-2">Cloud Identity</h4>
            
            <div className="bg-purple-900/10 border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 bg-purple-600/20 border-b border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-purple-400" size={20} />
                    <h5 className="text-sm font-black text-white uppercase tracking-widest">Sign In with Google</h5>
                  </div>
                  <HelpCircle size={14} className="text-purple-400 opacity-50" />
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Always show diagnostic info for sandbox environments */}
                <div className="p-5 bg-rose-500/10 border border-rose-500/30 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-rose-400">
                    <ShieldAlert size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Access Blocked Fix</span>
                  </div>
                  <p className="text-[10px] text-white/70 leading-relaxed font-bold">
                    1. Go to Google Cloud Console Credentials. <br/>
                    2. Add this EXACT link to "Authorized JavaScript origins":
                  </p>
                  <div className="bg-black/40 p-3 rounded-lg border border-rose-500/20 font-mono text-[10px] text-rose-400 flex justify-between items-center gap-2">
                    <span className="truncate select-all">{currentOrigin}</span>
                    <button 
                      onClick={copyOrigin} 
                      className="shrink-0 flex items-center gap-1.5 bg-rose-500/20 px-2 py-1 rounded hover:bg-rose-500/40 transition-colors"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      <span className="text-[8px] font-black uppercase tracking-widest">{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <a 
                    href="https://console.cloud.google.com/apis/credentials" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest text-white hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/20"
                  >
                    Open Console <ExternalLink size={12} />
                  </a>
                </div>

                <div id="googleBtnContainer" className="w-full min-h-[44px] flex items-center justify-center">
                  {isLoggingIn && (
                    <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-purple-900/10 border border-purple-500/20 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-purple-400 mb-2">
                <Phone size={18} />
                <span className="font-bold text-xs uppercase tracking-widest">Phone Recovery</span>
              </div>
              <div className="flex gap-2">
                <input 
                  type="tel" 
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 bg-black/40 border border-purple-500/10 p-4 rounded-xl text-white outline-none focus:border-purple-500 transition-colors text-sm"
                />
                <button 
                  onClick={handlePhoneVerify}
                  className="bg-purple-600 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-purple-500 transition-all"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-green-500/10 border border-green-500/20 p-5 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-green-500 rounded-full text-black">
                      <CheckCircle2 size={20} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Account Sync Active</p>
                      <p className="text-xs font-bold text-white/70">Progress linked to {user.email}</p>
                   </div>
                </div>
                <button 
                  onClick={logout}
                  className="p-3 hover:bg-white/5 rounded-2xl text-white/30 hover:text-rose-500 transition-colors"
                >
                  <LogOut size={20} />
                </button>
             </div>
          </div>
        )}

        <p className="text-[9px] text-purple-400/20 text-center uppercase font-bold tracking-[0.2em] mt-10">
          Cloud sync enables cross-device play & global leaderboards.
        </p>
      </div>
    </div>
  );
};

export default ProfileView;
