import {Hono} from 'hono'


type Env = {
    DB: D1Database;
};

const app = new Hono<{ Bindings: Env }>()

app.post('/get_version', async (c) => {

    try {
        const db = c.env.DB;
        const body = await c.req.json()
        const version = body.v;
        const betaFlag = body.b;
        if (typeof version !== 'string' || !/^[a-zA-Z0-9.]+$/.test(version)) {
            return c.json({status: 201, message: '参数错误'});
        }
        let sql = `SELECT * FROM \`${version}\``;

        if (betaFlag === "0" || betaFlag === "1") {
            sql += ` WHERE is_beta = ${betaFlag}`;
        }

        sql += ` ORDER BY update_time DESC, version_all DESC`;
        const {results} = await db.prepare(sql).all();
        return c.json({status: 200, message: results});
    } catch (e) {
        return c.json({status: 201, message: e.toString()}, 500);
    }
})


app.get('/search_version', async (c) => {
    try {
        const db = c.env.DB;
        const s = c.req.query('s')
        const b = c.req.query('b')
        const m = c.req.query('m')

        if (!s || !s.includes('.')) {
            return c.json({status: 201, message: "参数错误！"});
        }

        const [bigValue, desiredValue] = s.split('.');

        const table = `${bigValue}.${desiredValue}.x`;

        const isBeta = b === '0' || b === '1' ? ` AND is_beta = ?` : '';
        const sql = m === '1'
            ? `SELECT * FROM \`${table}\` WHERE version LIKE ?${isBeta} ORDER BY update_time DESC`
            : `SELECT * FROM \`${table}\` WHERE version = ?${isBeta} ORDER BY update_time DESC`;


        const params: any[] = [m === '1' ? `%${s}%` : s];
        if (isBeta) params.push(b);

        const {results} = await db.prepare(sql).bind(...params).all();

        return c.json({status: 200, message: results});
    } catch (error) {
        return c.json({status: 201, message: error.toString()}, 500);
    }
});

export default app