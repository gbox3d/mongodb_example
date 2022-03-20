import express from 'express'
import cors from 'cors'
import moment from 'moment'
import { ObjectId } from 'mongodb'
import verifyToken from '../middleware/verifyToken';

export default function (dbclient) {

    const router = express.Router()
    //cors 정책 설정 미들웨어 
    router.use(cors());

    router.use(express.raw({ limit: '500kb' })) //파일용량 1기가 바이트로 제한
    router.use(express.json({ limit: '500kb' })) //json 바디 미들웨어, content-type : application/json 일 경우 req.body로 받아온다.
    router.use(express.text({ limit: '500kb' })) //text 바디 미들웨어, content-type : application/text 일 경우 req.body로 받아온다.

    // router.use(verifyToken);

    router.route('/').get(verifyToken,(req, res) => {
        res.json({ r: 'ok', info: 'mongo db user mng system', user: req.decoded })
    })

    router.route('/add').post(async (req, res) => {

        console.log(req.body)

        let count = await dbclient.db('test').collection('user').count({
            userId: req.body.userId
        })
        console.log(count)

        if (count === 0) {

            dbclient.db('test').collection('user').insertOne({
                date: moment().format('YYYY-MM-DD HH:mm:ss'),
                userName: req.body.userName,
                userId: req.body.userId,
                userPw: req.body.userPw
            }, (err, result) => {
                if (err) {
                    console.log(err)
                    res.json({ r: 'fail', info: err })
                }
                else {
                    console.log(`inset count ${result.insertedCount} ok`)
                    res.json({ r: 'ok', info: `insert count : ${result.insertedCount}` })
                }
            })
        }
        else {
            res.json({ r: 'fail', info: 'userId already exist' })
        }
    });

    router.route('/list').get(verifyToken,async (req, res) => {
        console.log(req.query)

        try {
            let result = await dbclient.db('test').collection('user').find({}).toArray()

            console.log(`find count ${result.length} ok`)
            res.json({ r: 'ok', info: result })
        }
        catch (err) {
            console.log(err)
            res.json({ r: 'fail', info: err })
        }

    });

    router.route('/find').post(verifyToken,async (req, res) => {
        console.log(req.body)
        try {
            let _result = await dbclient.db('test').collection('user').findOne({
                userId: req.body.userId
            })
            res.json({ r: 'ok', info: _result })
        }
        catch (err) {
            console.log(err)
            res.json({ r: 'fail', info: err })
        }
    })

    router.route('/count').get(verifyToken,async (req, res) => {
        console.log(req.query)

        try {
            if (req.decode.user.userId === 'admin') {
                let result = await dbclient.db('test')
                .collection('user')
                .countDocuments();
                return res.json({ r: 'ok', info: result });
            }
            else {
                return res.json({ r: 'fail', info: 'no permission' })
            }

        }
        catch (err) {
            console.log(err)
            return res.json({ r: 'fail', info: err })
        }
    });

    router.route('/delete').get(verifyToken,async (req, res) => {
        // console.log(req.body)
        try {
            let result = await dbclient.db('test').collection('user').deleteOne({
                userId: req.query.userId
            })

            console.log(`delete count ${result.deletedCount} ok`)
            res.json({
                r: 'ok',
                // info: `delete count : ${result.deletedCount}`,
                count: result.deletedCount
            })
        }
        catch (err) {
            console.log(err)
            res.json({ r: 'fail', info: err })
        }
    });

    router.route('/update').post(verifyToken,async (req, res) => {
        // console.log(req.body)
        try {
            let result = await dbclient.db('test').collection('user').updateOne({
                userId: req.body.userId
            }, {
                $set: {
                    userName: req.body.userName,
                    userPw: req.body.userPw
                }
            })
            console.log(`update count ${result.modifiedCount} ok`)
            res.json({
                r: 'ok',
                info: `update count : ${result.modifiedCount}`,
                count: result.modifiedCount
            })
        }
        catch (err) {
            console.log(err)
            res.json({ r: 'fail', info: err })
        }
    });

    return router
}



// export default router