import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  balance: number;
  level: number;
  avatar?: string;
  isVerified: boolean;
  isBanned: boolean;
  ownedGames: string[];
  ownedFrames: string[];
  friends: string[];
  activeFrame?: string;
}

interface Game {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  theme: string;
  ageRating: string;
}

interface Frame {
  id: string;
  name: string;
  price: number;
  borderStyle: string;
}

const mockGames: Game[] = [
  {
    id: '1',
    title: 'Cyber Runner',
    description: 'Футуристический раннер в неоновом киберпанк-мире',
    price: 299,
    image: '/placeholder.svg',
    theme: 'Экшен',
    ageRating: '12+'
  },
  {
    id: '2',
    title: 'Neon Racer',
    description: 'Гоночная аркада с яркими неоновыми трассами',
    price: 199,
    image: '/placeholder.svg',
    theme: 'Гонки',
    ageRating: '6+'
  },
  {
    id: '3',
    title: 'Galaxy Defense',
    description: 'Защити галактику от инопланетных захватчиков',
    price: 399,
    image: '/placeholder.svg',
    theme: 'Стратегия',
    ageRating: '16+'
  }
];

const defaultFrames: Frame[] = [
  { id: 'frame1', name: 'Неоновая рамка', price: 150, borderStyle: '4px solid #9b87f5' },
  { id: 'frame2', name: 'Золотая рамка', price: 250, borderStyle: '4px solid #FFD700' },
  { id: 'frame3', name: 'Киберпанк рамка', price: 350, borderStyle: '4px solid #0EA5E9' }
];

export default function Index() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [frames, setFrames] = useState<Frame[]>(defaultFrames);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState<'store' | 'library' | 'profile' | 'friends' | 'frames' | 'admin'>('store');
  const [editingProfile, setEditingProfile] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');

  useEffect(() => {
    const savedUsers = localStorage.getItem('galaxyUsers');
    const savedCurrentUser = localStorage.getItem('galaxyCurrentUser');
    const savedFrames = localStorage.getItem('galaxyFrames');
    
    if (savedUsers) {
      setAllUsers(JSON.parse(savedUsers));
    } else {
      const adminUser: User = {
        id: '1',
        email: 'suradaniil74@gmail.com',
        username: 'Admin',
        password: 'Shura1234321',
        balance: 5000,
        level: 1,
        isVerified: true,
        isBanned: false,
        ownedGames: [],
        ownedFrames: [],
        friends: []
      };
      setAllUsers([adminUser]);
      localStorage.setItem('galaxyUsers', JSON.stringify([adminUser]));
    }
    
    if (savedCurrentUser) {
      setCurrentUser(JSON.parse(savedCurrentUser));
    }
    
    if (savedFrames) {
      setFrames(JSON.parse(savedFrames));
    }
  }, []);

  useEffect(() => {
    if (allUsers.length > 0) {
      localStorage.setItem('galaxyUsers', JSON.stringify(allUsers));
    }
  }, [allUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('galaxyCurrentUser', JSON.stringify(currentUser));
      setAllUsers(prev => prev.map(u => u.id === currentUser.id ? currentUser : u));
    } else {
      localStorage.removeItem('galaxyCurrentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('galaxyFrames', JSON.stringify(frames));
  }, [frames]);

  const getLevelColor = (level: number) => {
    if (level >= 1 && level <= 5) return 'bg-gray-400';
    if (level >= 6 && level <= 10) return 'bg-red-500';
    if (level >= 11 && level <= 15) return 'bg-green-500';
    return 'bg-purple-500';
  };

  const isAdmin = currentUser?.email === 'suradaniil74@gmail.com';

  const handleAuth = () => {
    if (!email || !password) {
      toast.error('Заполните все поля');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Это не email');
      return;
    }

    if (isLogin) {
      const user = allUsers.find(u => u.email === email);
      if (!user) {
        toast.error('Такого аккаунта не существует');
        return;
      }
      if (user.isBanned) {
        toast.error('Вы заблокированы');
        return;
      }
      if (user.password !== password) {
        toast.error('Неверный пароль');
        return;
      }
      setCurrentUser(user);
      toast.success('Добро пожаловать в Galaxy!');
    } else {
      if (!username) {
        toast.error('Введите имя пользователя');
        return;
      }
      if (allUsers.find(u => u.email === email)) {
        toast.error('Аккаунт с таким email уже существует');
        return;
      }
      const newUser: User = {
        id: Date.now().toString(),
        email,
        username,
        password,
        balance: 0,
        level: 1,
        isVerified: false,
        isBanned: false,
        ownedGames: [],
        ownedFrames: [],
        friends: []
      };
      setAllUsers([...allUsers, newUser]);
      setCurrentUser(newUser);
      toast.success('Аккаунт создан! Добро пожаловать в Galaxy!');
    }
  };

  const handleBuyGame = (game: Game) => {
    if (!currentUser) return;
    
    if (currentUser.balance < game.price) {
      toast.error('Недостаточно средств');
      return;
    }

    if (currentUser.ownedGames.includes(game.id)) {
      toast.info('Игра уже куплена');
      return;
    }

    setCurrentUser({
      ...currentUser,
      balance: currentUser.balance - game.price,
      level: currentUser.level + 1,
      ownedGames: [...currentUser.ownedGames, game.id]
    });
    toast.success(`${game.title} добавлена в библиотеку!`);
  };

  const handleBuyFrame = (frame: Frame) => {
    if (!currentUser) return;
    
    if (currentUser.balance < frame.price) {
      toast.error('Недостаточно средств');
      return;
    }

    if (currentUser.ownedFrames.includes(frame.id)) {
      toast.info('Рамка уже куплена');
      return;
    }

    setCurrentUser({
      ...currentUser,
      balance: currentUser.balance - frame.price,
      level: currentUser.level + 1,
      ownedFrames: [...currentUser.ownedFrames, frame.id]
    });
    toast.success(`${frame.name} куплена!`);
  };

  const handleAddFriend = (friendId: string) => {
    if (!currentUser) return;
    if (currentUser.friends.includes(friendId)) {
      toast.info('Уже в друзьях');
      return;
    }
    setCurrentUser({
      ...currentUser,
      friends: [...currentUser.friends, friendId]
    });
    toast.success('Друг добавлен!');
  };

  const handleRemoveFriend = (friendId: string) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      friends: currentUser.friends.filter(id => id !== friendId)
    });
    toast.success('Друг удален');
  };

  const handleSetActiveFrame = (frameId: string) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      activeFrame: frameId
    });
    toast.success('Рамка установлена!');
  };

  const handleUpdateProfile = () => {
    if (!currentUser || !newUsername.trim()) return;
    setCurrentUser({
      ...currentUser,
      username: newUsername
    });
    setEditingProfile(false);
    toast.success('Профиль обновлен!');
  };

  const handleBanUser = (userId: string) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? {...u, isBanned: !u.isBanned} : u));
    const user = allUsers.find(u => u.id === userId);
    if (user?.id === currentUser?.id && !user.isBanned) {
      setCurrentUser(null);
      toast.error('Вы были заблокированы');
    } else {
      toast.success(user?.isBanned ? 'Пользователь разблокирован' : 'Пользователь заблокирован');
    }
  };

  const handleVerifyUser = (userId: string) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? {...u, isVerified: !u.isVerified} : u));
    toast.success('Верификация изменена');
  };

  const handleUpdateBalance = (userId: string, newBalance: number) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? {...u, balance: newBalance} : u));
    if (userId === currentUser?.id) {
      setCurrentUser({...currentUser, balance: newBalance});
    }
    toast.success('Баланс обновлен');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setUsername('');
    toast.info('Вы вышли из аккаунта');
  };

  const getUserFrame = (user: User) => {
    if (!user.activeFrame) return undefined;
    return frames.find(f => f.id === user.activeFrame);
  };

  const filteredUsers = allUsers.filter(u => 
    u.id !== currentUser?.id && 
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedFilteredUsers = [...filteredUsers].sort((a, b) => {
    if (a.isVerified && !b.isVerified) return -1;
    if (!a.isVerified && b.isVerified) return 1;
    return 0;
  });

  const adminFilteredUsers = allUsers.filter(u => 
    u.username.toLowerCase().includes(adminSearchQuery.toLowerCase())
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A1F2C] via-[#2D1F3F] to-[#1A1F2C] p-4">
        <Card className="w-full max-w-md border-2 border-[hsl(var(--primary))] bg-[hsl(var(--dark-card))] shadow-2xl animate-fade-in">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] bg-clip-text text-transparent">
              Galaxy
            </CardTitle>
            <CardDescription className="text-gray-400">
              {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[hsl(var(--dark-bg))] border-[hsl(var(--border))] focus:border-[hsl(var(--primary))] transition-all"
              />
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Имя пользователя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-[hsl(var(--dark-bg))] border-[hsl(var(--border))] focus:border-[hsl(var(--primary))] transition-all"
                />
              </div>
            )}
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[hsl(var(--dark-bg))] border-[hsl(var(--border))] focus:border-[hsl(var(--primary))] transition-all"
              />
            </div>
            <Button 
              onClick={handleAuth}
              className="w-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] hover:opacity-90 transition-all neon-glow"
            >
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Button>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-sm text-gray-400 hover:text-[hsl(var(--primary))] transition-colors"
            >
              {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] via-[#2D1F3F] to-[#1A1F2C]">
      <nav className="border-b border-[hsl(var(--border))] bg-[hsl(var(--dark-card))]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] bg-clip-text text-transparent">
              Galaxy
            </h1>
            <div className="hidden md:flex gap-6">
              <Button 
                variant="ghost" 
                onClick={() => setActiveTab('store')}
                className={`text-gray-300 hover:text-white hover:bg-[hsl(var(--primary))]/20 ${activeTab === 'store' ? 'bg-[hsl(var(--primary))]/20 text-white' : ''}`}
              >
                Магазин
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setActiveTab('library')}
                className={`text-gray-300 hover:text-white hover:bg-[hsl(var(--primary))]/20 ${activeTab === 'library' ? 'bg-[hsl(var(--primary))]/20 text-white' : ''}`}
              >
                Библиотека
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setActiveTab('friends')}
                className={`text-gray-300 hover:text-white hover:bg-[hsl(var(--primary))]/20 ${activeTab === 'friends' ? 'bg-[hsl(var(--primary))]/20 text-white' : ''}`}
              >
                Друзья
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setActiveTab('frames')}
                className={`text-gray-300 hover:text-white hover:bg-[hsl(var(--primary))]/20 ${activeTab === 'frames' ? 'bg-[hsl(var(--primary))]/20 text-white' : ''}`}
              >
                Рамки
              </Button>
              {isAdmin && (
                <Button 
                  variant="ghost" 
                  onClick={() => setActiveTab('admin')}
                  className={`text-gray-300 hover:text-white hover:bg-[hsl(var(--primary))]/20 ${activeTab === 'admin' ? 'bg-[hsl(var(--primary))]/20 text-white' : ''}`}
                >
                  <Icon name="Shield" className="mr-2" size={18} />
                  Админ панель
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/20"
              onClick={() => window.open('https://t.me/BazukaAttack', '_blank')}
            >
              <Icon name="Plus" className="mr-2" size={16} />
              {currentUser.balance} ₽
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveTab('profile')}
              className="text-gray-400 hover:text-white"
            >
              <Icon name="User" size={24} />
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'store' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Популярные игры</h2>
              <Button className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] neon-glow">
                <Icon name="Upload" className="mr-2" size={18} />
                Опубликовать игру
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockGames.map((game) => (
                <Card
                  key={game.id}
                  className="overflow-hidden border-2 border-[hsl(var(--border))] bg-[hsl(var(--dark-card))] hover:border-[hsl(var(--primary))] transition-all duration-300 hover:scale-105 hover:neon-glow group"
                >
                  <div className="aspect-video bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--secondary))]/20 relative overflow-hidden">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-2 right-2 bg-[hsl(var(--primary))]">
                      {game.theme}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{game.title}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {game.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-gray-600">
                          {game.ageRating}
                        </Badge>
                        <span className="text-2xl font-bold text-[hsl(var(--primary))]">
                          {game.price} ₽
                        </span>
                      </div>
                      <Button
                        onClick={() => handleBuyGame(game)}
                        disabled={currentUser.ownedGames.includes(game.id)}
                        className={
                          currentUser.ownedGames.includes(game.id)
                            ? 'bg-green-600 hover:bg-green-600'
                            : 'bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))]'
                        }
                      >
                        {currentUser.ownedGames.includes(game.id) ? (
                          <>
                            <Icon name="Check" className="mr-2" size={18} />
                            Куплено
                          </>
                        ) : (
                          <>
                            <Icon name="ShoppingCart" className="mr-2" size={18} />
                            Купить
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'library' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold">Моя библиотека</h2>
            {currentUser.ownedGames.length === 0 ? (
              <Card className="border-2 border-dashed border-[hsl(var(--border))] bg-[hsl(var(--dark-card))]/50">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Icon name="Library" size={64} className="text-gray-600 mb-4" />
                  <p className="text-xl text-gray-400">Библиотека пуста</p>
                  <p className="text-sm text-gray-500">Купите игры в магазине</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockGames
                  .filter((game) => currentUser.ownedGames.includes(game.id))
                  .map((game) => (
                    <Card
                      key={game.id}
                      className="border-2 border-[hsl(var(--border))] bg-[hsl(var(--dark-card))] hover:border-[hsl(var(--primary))] transition-all"
                    >
                      <div className="aspect-video bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--secondary))]/20">
                        <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                      </div>
                      <CardHeader>
                        <CardTitle>{game.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))]">
                          <Icon name="Download" className="mr-2" size={18} />
                          Скачать
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex gap-4">
              <Button 
                onClick={() => setActiveTab('friends')}
                variant={activeTab === 'friends' ? 'default' : 'outline'}
              >
                Мои друзья
              </Button>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Поиск друзей</h2>
              <Input
                placeholder="Поиск пользователей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4 bg-[hsl(var(--dark-bg))] border-[hsl(var(--border))]"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedFilteredUsers.map((user) => {
                  const userFrame = getUserFrame(user);
                  const isFriend = currentUser.friends.includes(user.id);
                  return (
                    <Card key={user.id} className="bg-[hsl(var(--dark-card))] border-[hsl(var(--border))]">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Avatar 
                            className="w-16 h-16"
                            style={userFrame ? { border: userFrame.borderStyle } : {}}
                          >
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))]">
                              {user.username[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold">{user.username}</h3>
                              {user.isVerified && (
                                <Icon name="CheckCircle" size={18} className="text-green-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-400">Уровень {user.level}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {isFriend ? (
                          <Button 
                            onClick={() => handleRemoveFriend(user.id)}
                            variant="outline"
                            className="w-full border-red-500 text-red-500"
                          >
                            <Icon name="UserMinus" className="mr-2" size={18} />
                            Удалить из друзей
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleAddFriend(user.id)}
                            className="w-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))]"
                          >
                            <Icon name="UserPlus" className="mr-2" size={18} />
                            Добавить в друзья
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {currentUser.friends.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Мои друзья</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allUsers.filter(u => currentUser.friends.includes(u.id)).map((user) => {
                    const userFrame = getUserFrame(user);
                    return (
                      <Card key={user.id} className="bg-[hsl(var(--dark-card))] border-[hsl(var(--border))]">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <Avatar 
                              className="w-16 h-16"
                              style={userFrame ? { border: userFrame.borderStyle } : {}}
                            >
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))]">
                                {user.username[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold">{user.username}</h3>
                                {user.isVerified && (
                                  <Icon name="CheckCircle" size={18} className="text-green-500" />
                                )}
                              </div>
                              <p className="text-sm text-gray-400">Уровень {user.level}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Button 
                            onClick={() => handleRemoveFriend(user.id)}
                            variant="outline"
                            className="w-full border-red-500 text-red-500"
                          >
                            <Icon name="UserMinus" className="mr-2" size={18} />
                            Удалить
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'frames' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold">Магазин рамок</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {frames.map((frame) => (
                <Card
                  key={frame.id}
                  className="border-2 border-[hsl(var(--border))] bg-[hsl(var(--dark-card))] hover:border-[hsl(var(--primary))] transition-all"
                >
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div 
                        className="w-32 h-32 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))]"
                        style={{ border: frame.borderStyle }}
                      />
                    </div>
                    <CardTitle>{frame.name}</CardTitle>
                    <CardDescription className="text-2xl font-bold text-[hsl(var(--primary))]">
                      {frame.price} ₽
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => handleBuyFrame(frame)}
                      disabled={currentUser.ownedFrames.includes(frame.id)}
                      className={
                        currentUser.ownedFrames.includes(frame.id)
                          ? 'w-full bg-green-600 hover:bg-green-600'
                          : 'w-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))]'
                      }
                    >
                      {currentUser.ownedFrames.includes(frame.id) ? 'Куплено' : 'Купить'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {currentUser.ownedFrames.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Мои рамки</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {frames.filter(f => currentUser.ownedFrames.includes(f.id)).map((frame) => (
                    <Card
                      key={frame.id}
                      className="border-2 border-[hsl(var(--border))] bg-[hsl(var(--dark-card))]"
                    >
                      <CardHeader>
                        <div className="flex justify-center mb-4">
                          <div 
                            className="w-32 h-32 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))]"
                            style={{ border: frame.borderStyle }}
                          />
                        </div>
                        <CardTitle>{frame.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button
                          onClick={() => handleSetActiveFrame(frame.id)}
                          disabled={currentUser.activeFrame === frame.id}
                          className="w-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))]"
                        >
                          {currentUser.activeFrame === frame.id ? 'Установлена' : 'Установить'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="border-2 border-[hsl(var(--primary))] bg-[hsl(var(--dark-card))] neon-glow">
              <CardHeader>
                <div className="flex items-center gap-6">
                  <Avatar 
                    className="w-24 h-24"
                    style={getUserFrame(currentUser) ? { border: getUserFrame(currentUser)!.borderStyle } : { border: '4px solid hsl(var(--primary))' }}
                  >
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-2xl">
                      {currentUser.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {editingProfile ? (
                        <div className="flex gap-2 items-center">
                          <Input
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder={currentUser.username}
                            className="bg-[hsl(var(--dark-bg))]"
                          />
                          <Button onClick={handleUpdateProfile} size="sm">
                            <Icon name="Check" size={18} />
                          </Button>
                          <Button onClick={() => setEditingProfile(false)} size="sm" variant="outline">
                            <Icon name="X" size={18} />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <h2 className="text-3xl font-bold">{currentUser.username}</h2>
                          <Button onClick={() => { setEditingProfile(true); setNewUsername(currentUser.username); }} size="sm" variant="ghost">
                            <Icon name="Pencil" size={18} />
                          </Button>
                        </>
                      )}
                      {currentUser.isVerified && (
                        <Icon name="CheckCircle" size={24} className="text-green-500" />
                      )}
                    </div>
                    <p className="text-gray-400 mb-3">{currentUser.email}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-12 h-12 rounded-full ${getLevelColor(
                            currentUser.level
                          )} flex items-center justify-center font-bold text-lg border-2 border-white`}
                        >
                          {currentUser.level}
                        </div>
                        <span className="text-sm text-gray-400">Уровень Galaxy</span>
                      </div>
                      <Badge className="bg-[hsl(var(--primary))]">
                        {currentUser.ownedGames.length} игр
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-[hsl(var(--dark-bg))] border-[hsl(var(--border))]">
                    <CardHeader>
                      <CardTitle className="text-lg">Баланс</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-[hsl(var(--primary))]">
                        {currentUser.balance} ₽
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-[hsl(var(--dark-bg))] border-[hsl(var(--border))]">
                    <CardHeader>
                      <CardTitle className="text-lg">Игр в библиотеке</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-[hsl(var(--secondary))]">
                        {currentUser.ownedGames.length}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full border-red-500 text-red-500 hover:bg-red-500/20"
                >
                  <Icon name="LogOut" className="mr-2" size={18} />
                  Выйти из аккаунта
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'admin' && isAdmin && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold">Админ панель</h2>
            <Input
              placeholder="Поиск по имени пользователя..."
              value={adminSearchQuery}
              onChange={(e) => setAdminSearchQuery(e.target.value)}
              className="bg-[hsl(var(--dark-bg))] border-[hsl(var(--border))]"
            />
            <div className="grid gap-4">
              {adminFilteredUsers.map((user) => (
                <Card key={user.id} className="bg-[hsl(var(--dark-card))] border-[hsl(var(--border))]">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))]">
                            {user.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-xl">{user.username}</h3>
                            {user.isVerified && (
                              <Icon name="CheckCircle" size={20} className="text-green-500" />
                            )}
                            {user.isBanned && (
                              <Badge variant="destructive">Забанен</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{user.email}</p>
                          <p className="text-sm text-gray-400">Уровень {user.level}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Icon name="Wallet" className="mr-2" size={16} />
                              {user.balance} ₽
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-[hsl(var(--dark-card))]">
                            <DialogHeader>
                              <DialogTitle>Изменить баланс</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Input
                                type="number"
                                defaultValue={user.balance}
                                onChange={(e) => {
                                  const newBalance = parseInt(e.target.value) || 0;
                                  handleUpdateBalance(user.id, newBalance);
                                }}
                                className="bg-[hsl(var(--dark-bg))]"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          onClick={() => handleVerifyUser(user.id)}
                          variant={user.isVerified ? 'default' : 'outline'}
                          size="sm"
                        >
                          <Icon name="CheckCircle" className="mr-2" size={16} />
                          {user.isVerified ? 'Убрать' : 'Верифицировать'}
                        </Button>
                        <Button
                          onClick={() => handleBanUser(user.id)}
                          variant={user.isBanned ? 'default' : 'destructive'}
                          size="sm"
                        >
                          <Icon name="Ban" className="mr-2" size={16} />
                          {user.isBanned ? 'Разбанить' : 'Забанить'}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
