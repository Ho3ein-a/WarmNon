const db = require('../../util/database');

class Admin {
    constructor() {

    }


    userCount() {
        return db.execute('SELECT COUNT(*) AS count FROM user');
    }

    usersPageList(offset, limit) {
        return db.execute(`SELECT * FROM user natural join dormitory LIMIT ${limit} OFFSET ${offset}`);
    }


    // fetch 
    adminsList() {
        return db.execute('select * from admin')
    }

    commentsList() {
        return db.execute('select * from user_comment join comment on comment.comment_id = user_comment.comment_id join bread on user_comment.bread_id = bread.bread_id')
    }

    usersList() {
        return db.execute('select * from user natural join dormitory')
    }

    dormitoriesList() {
        return db.execute('select * from dormitory')
    }

    breadsStoreList() {
        return db.execute('select * from bread where availability = 1')
    }
    breadsList() {
        return db.execute('select * from bread ')
    }

    ordersList() {
        return db.execute(`SELECT bread_name, bread.type as type,  \`order\`.type as order_type, order_id, user.user_id, \`order\`.date, TIME_FORMAT(STR_TO_DATE(time, '%h:%i:%s %p'), '%H:%i:%s') AS time , number, total_price, delivered, name, dormitory_name, pay, cancel
            FROM bread
            JOIN \`order\` ON bread.bread_id = \`order\`.bread_id
            JOIN user ON \`order\`.user_id = user.user_id
            JOIN dormitory ON user.dormitory_id = dormitory.dormitory_id
            order by date desc
;`)
    }



    uncompletedOrdersList(formattedNextDay, formattedTwoDaysLater) {
        console.log(formattedNextDay, formattedTwoDaysLater)

        return db.execute(`
            SELECT bread_name, bread.type AS type, \`order\`.type AS order_type, order_id, user.user_id, \`order\`.date as date,
            TIME_FORMAT(STR_TO_DATE(time, '%h:%i:%s %p'), '%H:%i:%s') AS time, number, total_price, delivered,
            name, dormitory_name, pay, cancel
            FROM bread
            JOIN \`order\` ON bread.bread_id = \`order\`.bread_id
            JOIN user ON \`order\`.user_id = user.user_id
            JOIN dormitory ON user.dormitory_id = dormitory.dormitory_id
            WHERE 
            (
                (\`order\`.date = ? AND \`order\`.type = "سریع" AND delivered = 0 AND cancel = 0 AND pay = 1  )   
                OR
                (\`order\`.date = ? AND delivered = 0 AND cancel = 0 AND pay = 1  )
            ) 
            
            ORDER BY date DESC;
        `, [formattedNextDay, formattedTwoDaysLater]);

    }



    dormitoryOrderList(formattedNextDay, formattedTwoDaysLater, dormitory_name) {

        return db.execute(`
           SELECT bread_name, bread.type AS type, \`order\`.type AS order_type, order_id, user.user_id, \`order\`.date as date,
            TIME_FORMAT(STR_TO_DATE(time, '%h:%i:%s %p'), '%H:%i:%s') AS time, number, total_price, delivered,
            name, dormitory_name, pay, cancel
            FROM bread
            JOIN \`order\` ON bread.bread_id = \`order\`.bread_id
            JOIN user ON \`order\`.user_id = user.user_id
            JOIN dormitory ON user.dormitory_id = dormitory.dormitory_id
            WHERE 
            (
                (\`order\`.date = ? AND \`order\`.type = "سریع" AND delivered = 0 AND cancel = 0 AND pay = 1  )   
                OR
                (\`order\`.date = ? AND delivered = 0 AND cancel = 0 AND pay = 1  )
            ) 
            AND    
            dormitory_name = ?
            ORDER BY date DESC;
        `, [formattedNextDay, formattedTwoDaysLater, dormitory_name])
    }

    dormitoryOrderSummary(formattedNextDay, formattedTwoDaysLater, dormitory_name) {
        return db.execute(`
           SELECT \`order\`.date AS date, bread_name, bread.type AS type,
                  SUM(number) AS total_quantity,
                  SUM(total_price) AS total_price
           FROM bread
           JOIN \`order\` ON bread.bread_id = \`order\`.bread_id
           JOIN user ON \`order\`.user_id = user.user_id
           JOIN dormitory ON user.dormitory_id = dormitory.dormitory_id
           WHERE 
               (
                   (\`order\`.date = ? AND \`order\`.type = "سریع" AND delivered = 0 AND cancel = 0 AND pay = 1)   
                   OR
                   (\`order\`.date = ? AND delivered = 0 AND cancel = 0 AND pay = 1)
               )
               AND dormitory_name = ?
           GROUP BY \`order\`.date, bread_name, bread.type
           ORDER BY date ASC;
        `, [formattedNextDay, formattedTwoDaysLater, dormitory_name]);
    }




    async commentsPaginationList(limit, offset) {
        return db.execute(`select * from user_comment join comment on comment.comment_id = user_comment.comment_id join bread on user_comment.bread_id = bread.bread_id LIMIT ${limit} OFFSET ${offset}`);

    }

    async countComments() {
        const query = `SELECT COUNT(*) AS count FROM comment`;
        const [rows] = await db.execute(query);
        return rows[0].count;
    }
    // fetch





    //add 

    addBread(bread_id, bread_name, price, date, type, availability, admin_id) {
        return db.execute('insert into bread(bread_id, bread_name, price, date, type, availability, admin_id ) values (?,?,?,?,?,?,?)', [bread_id, bread_name, price, date, type, availability, admin_id])
    }
    addAgainBread(bread_id) {
        return db.execute('update bread set availability = 1 where bread_id = ?', [bread_id])
    }

    //add



    //delete

    deleteBread(bread_id) {
        return db.execute('update bread set availability = 0 where bread_id = ?', [bread_id])
    }

    deleteUser(user_id) {
        return db.execute('delete from user where user_id = ?', [user_id])
    }
    //delete





    //update

    async updateOrderDelivered(order_id) {

        return db.execute('update \`order\` set delivered = 1 where order_id = ?', [order_id])


    }


    //update



}


module.exports = Admin; 