import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import { User, Mail, Lock, Upload, Loader2, ArrowRight, X, Check } from 'lucide-react';
import { Modal } from '../components/ui/modal';
import { Slider } from '../components/ui/slider';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Custom Cropper state
  const [isCropping, setIsCropping] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
        setError('Please upload a JPG or PNG image');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
        setIsCropping(true);
        setZoom(1);
        setOffset({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  // Custom Cropper Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCropSave = async () => {
    if (!imageRef.current || !containerRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to desired output size (e.g., 400x400)
    canvas.width = 400;
    canvas.height = 400;

    // Calculate drawing parameters
    // The container is 400x400 (or whatever we set in CSS).
    // The image is transformed by scale(zoom) and translate(offset.x, offset.y) relative to center?
    // Actually, let's simplify. We render the image centered, then apply offset.

    // We need to draw the visible portion of the image onto the canvas.
    // The container represents the crop area.

    const image = imageRef.current;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // We want to draw the image such that what is seen in the container is drawn on canvas.
    // Container center is (200, 200).
    // Image is drawn at (200 + offset.x, 200 + offset.y) with scale 'zoom'.
    // Origin of image transform is usually center.

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);
    // Draw image centered at current context origin
    ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "profile-photo.jpg", { type: "image/jpeg" });
        setProfilePhoto(file);
        setPreview(URL.createObjectURL(blob));
        setIsCropping(false);
        setTempImage(null);
      }
    }, 'image/jpeg', 0.9);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!profilePhoto) {
      setError('Profile photo is required');
      return;
    }

    setLoading(true);

    try {
      await signup(name, email, password, profilePhoto);
      navigate('/voting');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

        <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-500">
          <CardHeader className="space-y-1 text-center pb-8">
            <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
            <CardDescription>
              Join the club to participate in elections
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <div className="h-2 w-2 rounded-full bg-destructive" />
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="flex h-10 w-full rounded-xl border border-input bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="flex h-10 w-full rounded-xl border border-input bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium leading-none">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="flex h-10 w-full rounded-xl border border-input bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <input
                      type="file"
                      id="profilePhoto"
                      accept="image/jpeg,image/png"
                      onChange={handleFileChange}
                      required={!profilePhoto}
                      className="hidden"
                    />
                    <label
                      htmlFor="profilePhoto"
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-background/50 px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                    >
                      <Upload className="h-4 w-4" />
                      {profilePhoto ? profilePhoto.name : "Upload Photo"}
                    </label>
                  </div>
                  {preview && (
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-border">
                      <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">JPG or PNG, max 5MB</p>
              </div>

              <Button type="submit" className="w-full rounded-xl h-11 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300" disabled={loading || !profilePhoto}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Sign Up
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="font-medium text-primary hover:underline underline-offset-4 transition-all">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Cropping Modal */}
      <Modal
        isOpen={isCropping}
        onClose={() => {
          setIsCropping(false);
          setTempImage(null);
        }}
        title="Crop Profile Photo"
        className="max-w-xl"
      >
        <div className="space-y-6">
          <div
            ref={containerRef}
            className="relative h-[400px] w-full rounded-xl overflow-hidden bg-black cursor-move touch-none flex items-center justify-center"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {tempImage && (
              <img
                ref={imageRef}
                src={tempImage}
                alt="Crop target"
                draggable={false}
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                  maxWidth: 'none',
                  maxHeight: 'none',
                }}
                className="select-none"
              />
            )}
            {/* Overlay to show circular crop area hint */}
            <div className="absolute inset-0 pointer-events-none border-[100px] border-black/50 rounded-full" style={{ borderRadius: '50%' }}></div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Zoom</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <Slider
              value={[zoom]}
              min={0.5}
              max={3}
              step={0.1}
              onValueChange={(value) => setZoom(value[0])}
              className="py-4"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setIsCropping(false);
                setTempImage(null);
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleCropSave}
            >
              <Check className="mr-2 h-4 w-4" />
              Save Photo
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Signup;
