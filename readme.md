# mongo db for nodejs example

## 주요기능

*jwt 기반인증 로그인처리  
*database 연결,add,del,update,find  

## 몽고DB실행

퀵스타드 가이드 참고  
http://mongodb.github.io/node-mongodb-native/3.5/quick-start/quick-start/


## 드라이버 설치 

npm install mongodb --save

## project setup 


npm 모듈 새로 설치하기
```sh
npm i @babel/cli @babel/core @babel/node @babel/preset-env dotenv express fs-extra body-parser socket.io
npm i -D cross-env nodemon
```

기존 버전모듈로 설치하기
```sh
npm install
```

.env 파일 생성하기
```sh
PORT=3000 # port 번호
```

## 참고
공식 문서
http://mongodb.github.io/node-mongodb-native/

