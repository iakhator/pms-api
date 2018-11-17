// import request from 'supertest'
// import chai from 'chai'
// import app from '../../app'

// const superRequest = request.agent(app)
// const expect = chai.expect
// import db from '../models'

// let parentId

// describe('Location Api', () => {
//   before((done) => {
//     db.Location.create({
//       location_name: 'Lagos',
//       sub_location: null,
//       parent: false
//     }).then((newLocation) => {
//       parentId = newLocation.id
//       db.Population.create({
//         location_id: newLocation.id,
//         male: 3,
//         female: 4,
//         total: 3 + 4
//       }).then(done())
//     })
//   })

//   after(done => {
//     db.Population.destroy({
//       where: {}
//     }).then(() => {
//       db.Location.destroy({
//         where: {}
//       }).then(done())
//     })
//   })

//   describe('CREATE Location POST /locations', () => {

//     it('it should create a new location successfully when relevant data is supplied', done => {
//       superRequest.post('/api/location')
//         .set({
//           'content-type': 'application/json'
//         })
//         .send({
//           name: 'Abuja',
//           parentId: null,
//           male: 3,
//           female: 2
//         })
//         .end((err, res) => {
//           expect(res.status).to.equal(201)
//           expect(res.body.message).to.equal('Location created successfully')
//           expect(res.body.name).to.equal('Abuja')
//           expect(res.body.location.female).to.equal(2)
//           expect(res.body.location.male).to.equal(3)
//           expect(res.body.location.total).to.equal(5)
//           done()
//         })
//     })

//     it('it should not create a new location when any of name, male and female is empty ', done => {
//       superRequest.post('/api/location')
//         .set({
//           'content-type': 'application/json'
//         })
//         .send({
//           name: 'Abuja',
//           parentId: '',
//           male: '',
//           female: 2
//         })
//         .end((err, res) => {
//           expect(res.status).to.equal(400)
//           expect(res.body.message).to.equal('Request cannot be empty')
//           done()
//         })
//     })

//     it('it should create a location when an valid parentid is given', done => {
//       superRequest.post('/api/location')
//         .set({
//           'content-type': 'application/json'
//         })
//         .send({
//           name: 'Yaba',
//           male: 1,
//           female: 1,
//           parentId: parentId
//         })
//         .end((err, res) => {
//           expect(res.status).to.equal(201)
//           expect(res.body.message).to.equal('Location created successfully')
//           done()
//         })
//     })

//     it('it should not create a location when an invalid parentid is given', done => {
//       superRequest.post('/api/location')
//         .set({
//           'content-type': 'application/json'
//         })
//         .send({
//           name: 'Ikeja',
//           male: 1,
//           female: 1,
//           parentId: 100000
//         })
//         .end((err, res) => {
//           expect(res.status).to.equal(404)
//           expect(res.body.message).to.equal('Parent with that id does not exist')
//           done()
//         })
//     })

//     it('it should not create a location when female or male population is not an integer', done => {
//       superRequest.post('/api/location')
//         .set({
//           'content-type': 'application/json'
//         })
//         .send({
//           name: 'Kebbi',
//           parentId: '',
//           male: 12232,
//           female: 'sdasdd'
//         })
//         .end((err, res) => {
//           expect(res.status).to.equal(400)
//           expect(res.body.message).to.equal('Invalid population')
//           done()
//         })
//     })

//     describe('GET All Location GET /api/locations/', () => {
//       it('it should get all parent locations', done => {
//         superRequest.get('/api/locations')
//           .set({
//             'content-type': 'application/json'
//           })
//           .end((err, res) => {
//             expect(res.status).to.equal(200)
//             expect(res.body.results.length).to.be.greaterThan(0)
//             done()
//           })
//       })
//     })

//     describe('EDIT Location PUT /location', () => {
//       it('it should not update a location if name, female or male is not provided', done => {
//         superRequest.put(`/api/location/${parentId}`)
//           .set({
//             'content-type': 'application/json'
//           })
//           .send({
//             name: 'Kebbi',
//             male: 12232,
//             female: ''
//           })
//           .end((err, res) => {
//             expect(res.status).to.equal(400)
//             expect(res.body.message).to.equal('Request cannot be empty')
//             done()
//           })
//       })

//       it('it should not update a location if female or male provided is a not an integer', done => {
//         superRequest.put(`/api/location/${parentId}`)
//           .set({
//             'content-type': 'application/json'
//           })
//           .send({
//             name: 'Kebbi',
//             male: 'ururur',
//             female: '75'
//           })
//           .end((err, res) => {
//             expect(res.status).to.equal(400)
//             expect(res.body.message).to.equal('Invalid population')
//             done()
//           })
//       })

//       it('it should not update a location if location id is invalid', done => {
//         superRequest.put(`/api/location/0`)
//           .set({
//             'content-type': 'application/json'
//           })
//           .send({
//             name: 'Kebbi',
//             male: 1,
//             female: 2
//           })
//           .end((err, res) => {
//             expect(res.status).to.equal(404)
//             expect(res.body.message).to.equal('Location not found')
//             done()
//           })
//       })

//       it('it should update a location successfully if all condition is met(location id is valid, name, male, female is not empty)', done => {
//         superRequest.put(`/api/location/${parentId}`)
//           .set({
//             'content-type': 'application/json'
//           })
//           .send({
//             name: 'Kebbi',
//             male: 2,
//             female: 2
//           })
//           .end((err, res) => {
//             expect(res.status).to.equal(200)
//             expect(res.body.message).to.equal('Location updated successfully')
//             done()
//           })
//       })
//     })

//     describe('DELETE Location DELETE /api/location', () => {
//       it('it should delete a parent or sublocation successfully', done => {
//         setTimeout(done, 300)
//         superRequest.delete(`/api/location/${parentId}`)
//           .set({
//             'content-type': 'application/json'
//           })
//           .end((err, res) => {
//             expect(res.status).to.equal(200)
//             expect(res.body.message).to.equal('Location deleted successfully')
//             done()
//           })
//       })

//       it('it should fail to delete location for locationId that does not exist', done => {
//         superRequest.delete('/api/location/324324')
//           .set({
//             'content-type': 'application/json'
//           })
//           .end((err, res) => {
//             expect(res.status).to.equal(404)
//             expect(res.body.message).to.equal('Location not found')
//             done()
//           })
//       })

//       it('it should fail to delete location for locationId with invalid type', done => {
//         superRequest.delete('/api/location/invalid')
//           .set({
//             'content-type': 'application/json'
//           })
//           .end((err, res) => {
//             expect(res.status).to.equal(400)
//             expect(res.body.message).to.equal('Invalid location id')
//             done()
//           })
//       })
//     })
//   })
// })
