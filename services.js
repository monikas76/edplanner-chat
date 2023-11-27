const {db} =require('./db.js');

class Chat{

    saveConversation =async(partyA, partyB)=>{
        const SQLA =`SELECT conversation.id
        FROM conversation
        WHERE (conversation.partyA =? AND conversation.partyB =?) OR (conversation.partyA =? AND conversation.partyB =?)`;
        const [records, f] =await db.query(SQLA, [partyA, partyB, partyB, partyA]);
        if(records.length >0) return {id: records[0].id};
        const SQLB ="INSERT INTO conversation(partyA, partyB) VALUES(?, ?)";
        const [result, _] =await db.query(SQLB, [partyA, partyB]);
        return {id: result.insertId};
    }

    getConversationByParties =async(partyA, partyB)=>{
        const SQL =`SELECT conversation.id, chat.sender, chat.body, chat.sent_at, chat.read_at 
        FROM conversation 
        INNER JOIN chat ON conversation.id =chat.conversation
        WHERE (conversation.partyA =? AND conversation.partyB =?) OR (conversation.partyA =? AND conversation.partyB =?)`;
        const [records, _] =await db.query(SQL, [partyA, partyB, partyB, partyA]);
        return records.length >0? records: null;
    }

    getConversationByID =async id=>{
        const SQL =`SELECT conversation.id, chat.sender, chat.body, chat.sent_at, chat.read_at 
        FROM conversation 
        INNER JOIN chat ON conversation.id =chat.conversation
        WHERE conversation.id =?`;
        const [records, _] =await db.query(SQL, [id]);
        return records.length >0? records: null;
    }

    SendMessage =async(req, res)=>{
        const {sender, conversation, body} =req.body;
        try {
            const SQL ="INSERT INTO chat(sender, body, conversation) VALUES(?, ?, ?)";
            await db.query(SQL, [sender, body, conversation]);
            return res.status(201).json(await this.getConversationByID(conversation));
        } catch ({message}) {
            return res.status(401).json({message});
        }
    }

    SearchUsers =async (req, res)=>{
        const {q, exclude} =req.query;
        try {
            if(q.length <=0) return res.status(200).json([]);
            const SQL ="SELECT id, first_name, last_name FROM users WHERE (first_name LIKE ? OR last_name LIKE ?) AND NOT id =?";
            const [records, _] =await db.query(SQL, [`%${q}%`, `%${q}%`, exclude]);
            return res.status(200).json(records);
        } catch ({message}) {
            return res.status(500).json({message});
        }
    }

    StartConversation =async (req, res) =>{
        const {partyA, partyB} =req.body;
        try {
            return res.status(201).json(await this.saveConversation(partyA, partyB));
        } catch ({message}) {
            return res.status(401).json({message});
        }
    }

    GetConversation =async(req, res) =>{
        const {partyA, partyB} =req.query;
        try {
            let records =await this.getConversationByParties(partyA, partyB);
            if(!records) return res.status(200).json(await this.saveConversation(partyA, partyB));
            return res.status(200).json(records);
        } catch ({message}) {
            return res.status(500).json({message});
        }
    }

    GetUserConversations =async(req, res) =>{
        const {user} =req.params;
        try {
            const SQL =`SELECT conversation.id AS conversation, users.id AS user, users.first_name, users.last_name 
            FROM conversation 
            INNER JOIN users ON conversation.partyA =users.id OR conversation.partyB =users.id
            WHERE conversation.partyA =? OR conversation.partyB =?`;
            const [records, _] =await db.query(SQL, [user, user]);
            return res.status(200).json(records);
        } catch ({message}) {
            return res.status(500).json({message});
        }
    }

    DeleteConversation =async(req, res)=>{
        const {id} =req.params;
        try {
            const SQL =`DELETE FROM conversation WHERE id =?`;
            await db.query(SQL, [id]);
            return res.status(204)
        } catch ({message}) {
            return res.status(500).json({message});
        }
    }
}

module.exports =Chat;