import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import flash from 'connect-flash';
import expressLayouts from 'express-ejs-layouts';
import userRoutes from './modules/user/user.routes.js';
import userRoutes    from './modules/user/user.routes.js';
import videoRoutes   from './modules/video/video.routes.js';
import commentRoutes from './modules/comment/comment.routes.js';
import likeRoutes    from './modules/like/like.routes.js';
import followRoutes  from './modules/follow/follow.routes.js';

const app = express();

// Configuração do EJS + Layouts
app.set('views', path.join(process.cwd(), 'src/views/pages'));
app.set('layout', path.join(process.cwd(), 'src/views/layouts/main'));
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Middlewares globais
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'src/public')));

// Sessão + Flash
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.user = req.session.user || null;
  res.locals.title = 'Skill-Up-TDD';
  next();
});


// Rotas
app.use('/', userRoutes);
app.use('/', videoRoutes);
app.use('/', commentRoutes);
app.use('/', likeRoutes);
app.use('/', followRoutes);

app.get('/', (req, res) => res.render('index', { title: 'Skill-Up-TDD' }));

// 404
app.use((req, res) => res.status(404).render('error'));

export default app;