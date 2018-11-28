const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Location = require('../models').Location
const Population = require('../models').Population

module.exports = {

  createLocation (req, res) {
    const {
      name,
      parentId,
      male,
      female
    } = req.body
    if (name === '' || male === '' || female === '') {
      return res.status(400).send({
        message: 'Request cannot be empty'
      })
    }

    if (isNaN(male) || isNaN(female) || male < 0 || female < 0) {
      return res.status(400).send({
        message: 'Invalid population'
      })
    }

    if (parentId) {
      Location.findById(parentId)
        .then((parent) => {
          if (!parent) {
            return res.status(404).send({
              message: 'Parent with that id does not exist'
            })
          }
          const subLocation = parent.sub_location
          const newSubLocation = subLocation ? `${subLocation},${parentId}` : `${parentId}`
          Location.create({
            location_name: name,
            sub_location: newSubLocation,
            parent: true
          }).then((newLocation) => {
            const ids = newSubLocation.split(',')
            Population.findAll({
              where: {
                location_id: {
                  [Op.or]: ids
                }
              }
            }).then(pop => {
              pop.forEach(item => {
                item.update({
                  female: (female + item.female),
                  male: (male + item.male),
                  total: (male + female + item.total)
                })
              })
            })

            Population.create({
              location_id: newLocation.id,
              male: male,
              female: female,
              total: female + male
            }).then((location) => res.status(201).send({
              location,
              name: newLocation.location_name,
              message: 'Location created successfully'
            }))
              .catch(error => res.status(400).send(error))
          })
        })
    } else {
      Location.create({
        location_name: name,
        sub_location: null,
        parent: false
      }).then((newLocation) => {
        Population.create({
          location_id: newLocation.id,
          male: male,
          female: female,
          total: female + male
        }).then((location) => res.status(201).send({
          location,
          name: newLocation.location_name,
          message: 'Location created successfully'
        }))
          .catch(error => res.status(400).send(error))
      })
    }
  },

  getAllLocations (req, res) {
    Location.findAll({
      include: [{
        model: Population
      }],
      order: [
          ['location_name', 'DESC']
      ]
    })
      .then((locationPopulation) => {
        const results = locationPopulation.map((locationDensity) => {
          const male = locationDensity.Population.male
          const female = locationDensity.Population.female
          const total = male + female
          const name = locationDensity.location_name
          const parentIds = locationDensity.sub_location ? locationDensity.sub_location.split(',') : []
          return {
            name,
            female,
            male,
            total,
            parentIds
          }
        })

        res.status(200).send({
          results
        })
      })
      .catch(error => res.status(400).send(error))
  },

  updateLocation (req, res) {
    const {
      name,
      female,
      male
    } = req.body
    const {
      id
    } = req.params

    if (name === '' || female === '' || male === '') {
      return res.status(400).send({
        message: 'Request cannot be empty'
      })
    }

    if (isNaN(male) || isNaN(female) || male < 0 || female < 0) {
      return res.status(400).send({
        message: 'Invalid population'
      })
    }

    if (isNaN(id)) {
      return res.status(400).send({
        message: 'Invalid location id'
      })
    }
    Location.findById(id)
      .then(parent => {
        if (!parent) {
          return res.status(404).send({
            message: 'Location not found'
          })
        }
        const subLocation = parent.sub_location
        if (name) {
          parent.update({
            location_name: name
          })
        }
        const ids = subLocation ? subLocation.split(',') : []
        const currentLocationPopulationId = parent.id
        ids.push(currentLocationPopulationId)
        Population.findAll({
          where: {
            location_id: {
              [Op.or]: ids
            }
          }
        }).then(pop => {
          const result = pop.filter(item => item.location_id != currentLocationPopulationId)
          const currentLocationPopulation = pop.filter(item => item.location_id === currentLocationPopulationId)
          const newMale = male || currentLocationPopulation[0].male
          const newFemale = female || currentLocationPopulation[0].female
          const femaleDifference = newFemale - currentLocationPopulation[0].female
          const maleDifference = newMale - currentLocationPopulation[0].male
          if (currentLocationPopulation) {

          }
          getSubLocationIds(parent.id).then(ids => {
            if (ids.length) {
              getPopulationDetails(ids).then(detail => {
                currentLocationPopulation[0].update({
                  female: (newFemale + detail.female),
                  male: (newMale + detail.male),
                  total: (newFemale + newMale) + detail.total
                })
              })
            } else {
              currentLocationPopulation[0].update({
                female: newFemale,
                male: newMale,
                total: newFemale + newMale
              })
            }
          })

          if (result.length === 0) {
            res.status(200).send({
              message: 'Location updated successfully'
            })
          }
          result.forEach(item => {
            item.update({
              female: (item.female + femaleDifference),
              male: (item.male + maleDifference),
              total: ((item.male + maleDifference) + (item.female + femaleDifference))
            }).then(() => {
              res.status(200).send({
                message: 'Location updated successfully'
              })
            })
          })
        })
      })
  },

  deleteLocation (req, res) {
    const {
      id
    } = req.params
    if (isNaN(id)) {
      return res.status(400).send({
        message: 'Invalid location id'
      })
    }
    Location.findById(id).then(loc => {
      const ids = loc.sub_location ? loc.sub_location.split(',') : []
      ids.push(id)
      const newIds = ids.map(item => {
        return parseInt(item)
      })
      if (!loc) {
        return res.status(404).send({
          message: 'Location not found'
        })
      } else {
        const parentIds = newIds
        if (parentIds.length) {
          Population.findAll({
            where: {
              location_id: {
                [Op.or]: parentIds
              }
            }
          }).then(pop => {
            const result = pop.filter(value => value.location_id === parseInt(id))
            const result2 = pop.filter(value => value.location_id !== parseInt(id))
            if (!result2.length) {
              getSubLocationIds(id).then((currentIds) => {
                currentIds.push(parseInt(id))
                Population.destroy({
                  where: {
                    location_id: {
                      [Op.or]: currentIds
                    }
                  }
                }).then(() => {
                  Location.destroy({
                    where: {
                      id: {
                        [Op.or]: currentIds
                      }
                    }
                  }).then(() => res.status(200).send({
                    message: 'Location deleted successfully'
                  }))
                  .catch((error) => res.status(400).send(error))
                })
              })
            }
            result2.forEach(item => {
              item.update({
                female: (item.female - result[0].female),
                male: (item.male - result[0].male),
                total: ((item.female - result[0].female) + (item.male - result[0].male))
              }).then(() => {
                Population.destroy({
                  where: {
                    location_id: id
                  }
                }).then(() => {
                  Location.destroy({
                    where: {
                      id: id
                    }
                  })
                  .then(() => res.status(200).send({
                    message: 'Location deleted successfully'
                  }))
                  .catch((error) => res.status(400).send(error))
                })
              })
            })
          })
        }
      }
    })
  }
}

const getSubLocationIds = async (id) => {
  let ids = []
  await Location.findAll().then(loc => {
    loc.forEach(item => {
      if (item.sub_location && item.sub_location.indexOf(`${id}`) !== -1) {
        ids.push(item.id)
      }
    })
  })
  return ids
}

const getPopulationDetails = async (ids) => {
  let male = 0
  let female = 0
  let total = 0
  await Population.findAll({
    where: {
      location_id: {
        [Op.or]: ids
      }
    }
  }).then(pop => {
    pop.forEach(item => {
      male += item.male
      female += item.female
      total += (item.male + item.female)
    })
  })
  return {
    female,
    male,
    total
  }
}
