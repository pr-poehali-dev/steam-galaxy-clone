import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  username: string;
  balance: number;
  level: number;
  avatar?: string;
  isVerified: boolean;
  ownedGames: string[];
  ownedFrames: string[];
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

export default function Index() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const getLevelColor = (level: number) => {
    if (level >= 1 && level <= 5) return 'bg-gray-400';
    if (level >= 6 && level <= 10) return 'bg-red-500';
    if (level >= 11 && level <= 15) return 'bg-green-500';
    return 'bg-purple-500';
  };

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
      if (email === 'suradaniil74@gmail.com' && password === 'Shura1234321') {
        const adminUser: User = {
          id: '1',
          email,
          username: 'Admin',
          balance: 5000,
          level: 1,
          isVerified: true,
          ownedGames: [],
          ownedFrames: []
        };
        setCurrentUser(adminUser);
        toast.success('Добро пожаловать в Galaxy!');
      } else {
        toast.error('Неверный пароль или аккаунт не существует');
      }
    } else {
      if (!username) {
        toast.error('Введите имя пользователя');
        return;
      }
      const newUser: User = {
        id: Math.random().toString(),
        email,
        username,
        balance: 0,
        level: 1,
        isVerified: false,
        ownedGames: [],
        ownedFrames: []
      };
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

  const handleLogout = () => {
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setUsername('');
    toast.info('Вы вышли из аккаунта');
  };

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
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-[hsl(var(--primary))]/20">
                Магазин
              </Button>
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-[hsl(var(--primary))]/20">
                Библиотека
              </Button>
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-[hsl(var(--primary))]/20">
                Друзья
              </Button>
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
              onClick={handleLogout}
              className="text-gray-400 hover:text-white"
            >
              <Icon name="User" size={24} />
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="store" className="space-y-8">
          <TabsList className="bg-[hsl(var(--dark-card))] border border-[hsl(var(--border))]">
            <TabsTrigger value="store" className="data-[state=active]:bg-[hsl(var(--primary))]">
              <Icon name="Store" className="mr-2" size={18} />
              Магазин
            </TabsTrigger>
            <TabsTrigger value="library" className="data-[state=active]:bg-[hsl(var(--primary))]">
              <Icon name="Library" className="mr-2" size={18} />
              Библиотека
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-[hsl(var(--primary))]">
              <Icon name="User" className="mr-2" size={18} />
              Профиль
            </TabsTrigger>
          </TabsList>

          <TabsContent value="store" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="border-2 border-[hsl(var(--primary))] bg-[hsl(var(--dark-card))] neon-glow">
              <CardHeader>
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24 border-4 border-[hsl(var(--primary))]">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-2xl">
                      {currentUser.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-3xl font-bold">{currentUser.username}</h2>
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
