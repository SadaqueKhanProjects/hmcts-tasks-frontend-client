import { Application } from 'express';

export default function (app: Application): void {
  app.get('/', async (req, res) => {
    res.render('home', { title: 'Home Page' });
  });
}