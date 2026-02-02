import { useState } from "react";
import { X, Loader2, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
    const { login, register } = useAuth();
    const [mode, setMode] = useState<"login" | "register">(initialMode);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    // Form fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setUsername("");
        setConfirmPassword("");
        setError("");
        setShowPassword(false);
    };

    const switchMode = (newMode: "login" | "register") => {
        setMode(newMode);
        resetForm();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (mode === "register") {
            // Validation
            if (password.length < 6) {
                setError("Пароль должен быть не менее 6 символов");
                setLoading(false);
                return;
            }
            if (password !== confirmPassword) {
                setError("Пароли не совпадают");
                setLoading(false);
                return;
            }
            if (username.length < 2) {
                setError("Имя должно быть не менее 2 символов");
                setLoading(false);
                return;
            }

            const result = await register(username, email, password);
            if (result.success) {
                toast.success("Регистрация успешна! Добро пожаловать!");
                resetForm();
                onClose();
            } else {
                setError(result.error || "Ошибка регистрации");
            }
        } else {
            const result = await login(email, password);
            if (result.success) {
                toast.success("Вы успешно вошли!");
                resetForm();
                onClose();
            } else {
                setError(result.error || "Неверный email или пароль");
            }
        }

        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-heimish-pink/20 to-pink-100 px-6 py-8 text-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="text-2xl font-bold text-heimish-dark mb-2">
                        {mode === "login" ? "Вход в аккаунт" : "Регистрация"}
                    </h2>
                    <p className="text-sm text-gray-600">
                        {mode === "login" 
                            ? "Войдите, чтобы оставлять отзывы" 
                            : "Создайте аккаунт за 30 секунд"}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {mode === "register" && (
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Ваше имя"
                                required
                                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-heimish-pink focus:border-transparent transition-all"
                            />
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-heimish-pink focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Пароль"
                            required
                            minLength={6}
                            className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-heimish-pink focus:border-transparent transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5 text-gray-400" />
                            ) : (
                                <Eye className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                    </div>

                    {mode === "register" && (
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Подтвердите пароль"
                                required
                                minLength={6}
                                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-heimish-pink focus:border-transparent transition-all"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-heimish-dark text-white rounded-xl font-medium hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {mode === "login" ? "Вход..." : "Регистрация..."}
                            </>
                        ) : (
                            mode === "login" ? "Войти" : "Зарегистрироваться"
                        )}
                    </button>

                    {/* Switch mode */}
                    <div className="text-center text-sm text-gray-600 pt-2">
                        {mode === "login" ? (
                            <>
                                Нет аккаунта?{" "}
                                <button
                                    type="button"
                                    onClick={() => switchMode("register")}
                                    className="text-heimish-pink font-medium hover:underline"
                                >
                                    Зарегистрируйтесь
                                </button>
                            </>
                        ) : (
                            <>
                                Уже есть аккаунт?{" "}
                                <button
                                    type="button"
                                    onClick={() => switchMode("login")}
                                    className="text-heimish-pink font-medium hover:underline"
                                >
                                    Войдите
                                </button>
                            </>
                        )}
                    </div>
                </form>

                {/* Benefits */}
                <div className="px-6 pb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 text-center">
                            🎁 Зарегистрированные пользователи получают бонусы за отзывы
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
