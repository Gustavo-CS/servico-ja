
## Getting Started
A fim de organização faça os seguintes passos
altere para 2 o
- Tab Size
e desative o
- Detect Indentation

Ao iniciar o projeto ou a cada nova atualização de bibliotecas rode:

npm install

Adicione o .env com os seguintes campos:
`POSTGRES_HOST=host`
`POSTGRES_PORT=5432`
`POSTGRES_USER=user`
`POSTGRES_DB=db`
`POSTGRES_PASSWORD=password`
`DATABASE_URL=url_neon`
`JWT_SECRET="9e34fa6a8c9d4176a0a5b8cd2e43cfb8416aa6e51ffad8cb42dcf8cdef12a304"`
`CLOUDINARY_API_SECRET="aquelas strings bem estranhas"`
`CLOUDINARY_API_KEY="digitos 12345678"`
`CLOUDINARY_CLOUD_NAME="cloudname"`

Para buscar mudanças no banco de dados rode:
`npm run db:pull`

Para subir mudanças para o banco:
- altere o arquivo `schema.js` com as mudanças requeridas
e rode:
`npm run db:push`
**ANTES DE QUALQUER MUDANÇA RODE `npm run db:pull`**

Para rodar o site localmente:

npm run dev

Abra [http://localhost:3000]


You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.





This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
