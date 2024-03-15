import {Server} from 'socket.io';
import Connection from './database/db.js';
import { getDocument, updateDocument  } from './controllers/document-controller.js';
require("dotenv").config();
const PORT= process.env.PORT||9000;
Connection();
const io = new Server(PORT,{
	cors: {
		origin: ['http://localhost:3000', 'https://zingy-lollipop-550839.netlify.app/docs/cce06a0d-afb3-40a7-b616-961a36d59263'],
		methods: ['GET', 'POST']
	}
});

io.on('connection',socket=>{
	socket.on('get-document', async documentId => {
		// const data = "" ;
		const document = await getDocument(documentId);

		socket.join(documentId);
		socket.emit('load-document',document.data);

		socket.on('send-changes',delta =>{
			// console.log(delta);

			////messages are broadcast at all documents
			// socket.broadcast.emit('recieve-changes',delta);


			//messages are broadcast at perticular id
			socket.broadcast.to(documentId).emit('recieve-changes',delta);
		})
		socket.on('save-document',async data =>{
			await updateDocument(documentId, data);
		})
	})
});




