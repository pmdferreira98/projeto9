let app =require("../src/app")
let supertest = require("supertest");
let request = supertest(app);

let mainUser = {name: "Pedro Ferreira", email: "pedro.ferreira@gmail.com", password:"12345"};

beforeAll(() =>{
    request.post("/user")
    .send(mainUser)
    .then(res => {})
    .catch(err =>{console.log(err)});
})

afterAll(() =>{
    request.delete(`/user/${mainUser.email}`)
    .then(res =>{})
    .catch(err => {console.log(err)});
})


describe ("Registo de utilizador", () =>{

    test("deve registar um utilizador com sucesso",() =>{
        let time = Date.now();
        let email = `${time}@gmail.com`;
        let user = {name: "Pedro", email: email, password:"12345"}

        return request.post("/user")
        .send(user).then(res =>{
            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email);
        }).catch(err =>{
            fail(err);
        })
    })

    test("Deve impedir que um utilizador se registe com os dados vazios", () =>{
        let user = {name: "", email: "", password:""}

        return request.post("/user")
        .send(user).then(res =>{
            expect(res.statusCode).toEqual(400);
        }).catch(err =>{
            fail(err);
        })
    })

    test("Deve impedir que um utilizzador se registe com um email repetido", () =>{
        let time = Date.now();
        let email = `${time}@gmail.com`;
        let user = {name: "Pedro", email: email, password:"12345"}

        return request.post("/user")
        .send(user).then(res =>{
            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email);

            return request.post("/user")
            .send(user)
            .then(res =>{
                expect(res.statusCode).toEqual(400);
                expect(res.body.error).toEqual("Email já está registado")
            }).catch(err =>{
                fail(err);
            });
        }).catch(err =>{
            fail(err);
        })
    })
})

describe("Autenticação", () =>{
    test("Deve devolver um token quando logar", () =>{
        return request.post("/auth")
        .send({email: mainUser.email, password: mainUser.password})
        .then(res =>{
            expect(res.statusCode(200));
            expect(res.body.token).toBeDefined();
        }).catch(err =>{
            fail(err);
        })
    })

    test("Deve impedir que um utilizador não registado dê login", () =>{
        return request.post("/auth")
        .send({email:"oewfnoienfioewofn@ofbownfo.com", password: "492869f"})
        .then(res =>{
            expect(res.statusCode(403));
            expect(res.body.errors.email).toEqual("Email não registado");
        }).catch(err =>{
            fail(err);
        })
    })

    test("Deve impedir que um utilizador dê login com uma senha errada", () =>{
        return request.post("/auth")
        .send({email:"pedro.ferreira@gmail.com", password: "492869f"})
        .then(res =>{
            expect(res.statusCode(403));
            expect(res.body.errors.password).toEqual("Senha errada");
        }).catch(err =>{
            fail(err);
        })
    })
})