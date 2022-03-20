import express from 'express'
import cors from 'cors'
import moment from 'moment'
import { ObjectId } from 'mongodb'
import verifyToken from '../middleware/verifyToken'

export default function (dbclient) {

    const router = express.Router()

    //cors 정책 설정 미들웨어 
    router.use(cors());

    //직 접구현하는 옛날방식
    // router.use((req, res, next) => {

    //     res.set('Access-Control-Allow-Origin', '*'); //cors 전체 허용
    //     res.set('Access-Control-Allow-Methods', '*');
    //     res.set("Access-Control-Allow-Headers", "*");

    //     console.log(req.header('content-type'))
    //     console.log(`check file control mw auth ${req.originalUrl}`)
    //     next()
    // })



    //raw 바디 미들웨어, content-type : application/octet-stream 일 경우 req.body로 받아온다.
    router.use(express.raw({ limit: '500kb' })) //파일용량 1기가 바이트로 제한
    router.use(express.json({ limit: '500kb' })) //json 바디 미들웨어, content-type : application/json 일 경우 req.body로 받아온다.
    router.use(express.text({ limit: '500kb' })) //text 바디 미들웨어, content-type : application/text 일 경우 req.body로 받아온다.

    router.use(verifyToken); //토큰 검증 미들웨어


    router.route('/').get((req, res) => {
        res.json({ r: 'ok', info: 'mongo db log mang system ' + req.decoded.userId })
    })

    //로그 등록
    router.route('/add').post((req, res) => {
        console.log(req.body)
        dbclient.db('test').collection('log').insertOne({
            date: moment().format('YYYY-MM-DD HH:mm:ss'),
            content: req.body.content,
            userId: req.decoded.userId
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
        // res.json({ r: 'ok', info: 'log post' })
    });

    //로그 리스팅 
    router.route('/list').get((req, res) => {
        console.log(req.query)
        dbclient.db('test').collection('log').find({
            userId: req.decoded.userId
        })
            .skip(parseInt(req.query.skip))
            .limit(parseInt(req.query.limit))
            .toArray((err, result) => {
                if (err) {
                    console.log(err)
                    res.json({ r: 'fail', info: err })
                }
                else {
                    console.log(`find count ${result.length} ok`)
                    res.json({ r: 'ok', info: result })
                }
            })
    });

    //로그카운트
    router.route('/count').get(async (req, res) => {
        console.log(req.query)

        try {
            let result = await dbclient.db('test')
                .collection('log')
                .countDocuments({
                    userId: req.decoded.userId
                });
            return res.json({ r: 'ok', info: result });

        }
        catch (err) {
            console.log(err)
            res.json({ r: 'fail', info: err })
        }

        // dbclient.db('test').collection('log').count((err, result) => {
        //     if (err) {
        //         console.log(err)
        //         res.json({ r: 'fail', info: err })
        //     }
        //     else {
        //         console.log(`find count ${result} ok`)
        //         res.json({ r: 'ok', info: result })
        //     }
        // })
    });
    router.route('/delete').get(async (req, res) => {
        // console.log(req.body)
        try {
            let result = await dbclient.db('test').collection('log').deleteOne({
                _id: new ObjectId(req.query.id),
                userId: req.decoded.userId
            })

            console.log(`delete count ${result.deletedCount} ok`)
            res.json({ r: 'ok', info: `delete count : ${result.deletedCount}` })
        }
        catch (err) {
            console.log(err)
            res.json({ r: 'fail', info: err })
        }
    });

    router.route('/update').post(async (req, res) => {
        // console.log(req.body)
        try {
            let result = await dbclient.db('test').collection('log').updateOne({
                _id: new ObjectId(req.body.id),
                userId: req.decoded.userId
            }, {
                $set: {
                    content: req.body.content
                }
            })
            console.log(`update count ${result.modifiedCount} ok`)
            res.json({ r: 'ok', info: `update count : ${result.modifiedCount}` })

        }
        catch (err) {
            console.log(err)
            res.json({ r: 'fail', info: err })
        }
    });

    return router
}



// export default router