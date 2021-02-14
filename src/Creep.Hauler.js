'use strict';

const C = require('./constants');

const CreepWorker = require('./Creep.Worker');

/**
 * Wrapper class for creeps with logic for a hauler.
 * Primary purpose of these creeps are to move resources from the perimeter of a room and into the center.
 */
class CreepHauler extends CreepWorker {
    /**
     * Perform resource collection logic.
     */
    collecting () {
        // Perform random repairs or construction work.
        this.working();

        // Drops can be picked up by any hauler on the move in any room
        if (this.room.drops.length > 0) {
            const drop = this.getFirstInRange(this.room.drops, 1);
            if (drop !== null) {
                this.pickup(drop);
            }
        }

        const room = this.workRoom;

        if (!this.atWork && !room.isVisible) {
            Empire.observe(room.name, 10);
            this.moveTo(new RoomPosition(25, 25, room.name), { range: 20 });
            return;
        }

        if (room.containers.length > 0) {
            const container = this.getFirstInRange(room.containers, 1);
            if (container !== null) {
                for (const resourceType in container.store) {
                    if (this.withdraw(container, resourceType) === OK) {
                        break;
                    }
                }
            }
        }

        const target = Game.getObjectById(this._mem.collectingTarget);
        if (target === null) {
            delete this._mem.collectingTarget;
        }

        if (this.room.drops.length > 0) {
            for (const drop of this.room.drops) {
                if (this.room.reserve(drop.id, this.job, this.name)) {
                    this._mem.collectingTarget = drop.id;
                    break;
                }
            }
        }
    }

    /**
     * Perform resource delivery logic.
     */
    delivering () {
        // Perform random repairs or construction work.
        this.working();
    }

    /**
     * Perform random repairs or construction work.
     */
    working () {
        if (this.strength > 0 && this.energy > 0) {
            // This hauler can perform random work on the move.
            if (this.room.repairs.length > 0) {
                const target = this.getFirstInRange(this.room.repairs, 2);
                if (target !== null) {
                    if (this.repair(target) === OK) {
                        return;
                    }
                }
            }
            if (this.room.constructionSites.length > 0) {
                const target = this.getFirstInRange(this.room.constructionSites, 2);
                if (target !== null) {
                    this.build(target);
                }
            }
        }
    }

    /**
     * Perform hauling related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work () {
        if (this.strength > 0 && this.energy > 0) {
            const structure = this.getFirstInRange(this.room.repairs, 3);
            if (structure !== null) {
                this.repair(structure);
            }
        }

        if (this.strength > 0 && this.energy > 0) {
            const constructionSite = this.getFirstInRange(this.room.constructionSites, 3);
            if (constructionSite !== null) {
                this.build(constructionSite);
            }
        }

        if (this.load < this.capacity) {
            const drop = this.getFirstInRange(this.room.drops, 1);
            if (drop !== null) {
                this.pickup(drop);
            }
        }

        if (this.load < this.capacity) {
            const tombstone = this.getFirstInRange(this.room.tombstones, 1);
            if (tombstone !== null) {
                for (const resourceType in tombstone.store) {
                    const result = this.withdraw(tombstone, resourceType);
                    if (result === OK) {
                        break;
                    }
                }
            }
        }

        // Taking from a container should only be done in the work room.
        if (this.atWork && this.load < this.capacity) {
            const container = this.getFirstInRange(this.room.containers, 1);
            if (container !== null) {
                for (const resourceType in container.store) {
                    const result = this.withdraw(container, resourceType);
                    if (result === OK) {
                        break;
                    }
                }
            }
        }

        if (!this.isRemoting && this.isHome && this.load < this.capacity) {
            if (this.room.terminal !== null && (this.room.terminal.store.energy > C.TERMINAL_THRESHOLD_ENERGY || this.room.terminal.store.energy > this.room.storage.store.energy)) {
                this.withdraw(this.room.terminal, RESOURCE_ENERGY);
            }
        }

        // Delivering to a container or link should only be done by a remote hauler back at home.
        if (this.isRemoting && this.isHome && this.load > 0) {
            if (this.room.containers.length > 0) {
                const container = this.getFirstInRange(this.room.containers, 1);
                if (container !== null) {
                    for (const resourceType in this.store) {
                        if (this.store[resourceType] > 0) {
                            if (this.transfer(container, resourceType) === OK) {
                                break;
                            }
                        }
                    }
                }
            }
            if (this.energy > 0 && this.room.links.inputs.length > 0) {
                const links = this.pos.findInRange(this.room.links.inputs, 1);
                if (links.length > 0) {
                    for (const link of links) {
                        if (link.energy < link.energyCapacity) {
                            this.transfer(link, RESOURCE_ENERGY);
                        }
                    }
                }
            }
        }

        if (this.isHome) {
            const storage = this.room.storage;
            if (storage !== null && this.pos.isNearTo(storage)) {
                for (const resourceType in this.store) {
                    if (this.store[resourceType] > 0) {
                        if (this.transfer(storage, resourceType) === OK) {
                            break;
                        }
                    }
                }
            }

            if (this.room.spawns.length > 0) {
                const spawn = this.getFirstInRange(this.room.spawns, 1, (x) => x.energy < x.energyCapacity);
                if (spawn !== null) {
                    this.transfer(spawn, RESOURCE_ENERGY);
                }
            }

            if (this.room.extensions.length > 0) {
                const extension = this.getFirstInRange(this.room.extensions, 1, (x) => x.energy < x.energyCapacity);
                if (extension !== null) {
                    this.transfer(extension, RESOURCE_ENERGY);
                }
            }

            if (this.room.towers.length > 0) {
                const tower = this.getFirstInRange(this.room.towers, 1);
                if (tower !== null) {
                    this.transfer(tower, RESOURCE_ENERGY);
                }
            }
        }

        if (this.load <= 0) {
            this.isWorking = true;
        }

        // In case the creep has used som energy for repairs we offset the capacity by one.
        if (this.load >= this.capacity - 1) {
            this.isWorking = false;
        }

        let moveTarget = null;

        if (this.isWorking) {
            const target = Game.getObjectById(this._mem.work.target);
            if (target === null) {
                delete this._mem.work.target;
            }

            if (moveTarget === null) {
                if (this.atWork) {
                    if (this.room.drops.length > 0) {
                        for (const drop of this.room.drops) {
                            if (this.room.reserve(drop.id, this.job, this.name)) {
                                this._mem.target = drop.id;
                                moveTarget = drop;
                                break;
                            }
                        }
                    }
                    if (this.room.tombstones.length > 0) {
                        for (const tombstone of this.room.tombstones) {
                            if (this.room.reserve(tombstone.id, this.job, this.name)) {
                                this._mem.target = tombstone.id;
                                moveTarget = tombstone;
                                break;
                            }
                        }
                    }
                }
            }

            if (moveTarget === null) {
                const room = this.atWork ? this.room : this.workRoom;
                if (room.isVisible) {
                    if (room.containers.length > 0) {
                        for (const container of room.containers) {
                            if (container.store.getUsedCapacity() > 400) {
                                if (room.reserve(container.id, this.job, this.name)) {
                                    this._mem.work.target = container.id;
                                    moveTarget = container;
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            if (moveTarget === null && !this.atWork) {
                moveTarget = this.moveToRoom(this._mem.rooms.work, false);
            }

            if (moveTarget === null && !this.isRemoting && this.isHome && this.load < this.capacity) {
                if (this.room.terminal !== null) {
                    this._mem.work.target = this.room.terminal.id;
                    moveTarget = this.room.terminal;
                }
            }
        }
        else {
            if (moveTarget === null && !this.isHome) {
                moveTarget = this.moveToRoom(this._mem.rooms.home, false);
            }

            if (moveTarget === null) {
                let range = 50;

                // Ensure the creep only carry energy. No need to seek out a link otherwise.
                if (this.isRemoting && this.energy > 0 && this.energy === this.load && this.room.links.inputs.length > 0) {
                    for (const link of this.room.links.inputs) {
                        if (link.energy >= link.energyCapacity) {
                            continue;
                        }
                        const rangeToLink = this.pos.getRangeTo(link);
                        if (range > rangeToLink) {
                            range = rangeToLink;
                            moveTarget = link;
                        }
                    }
                }

                if (this.room.storage && this.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 15000) {
                    const rangeToStorage = this.pos.getRangeTo(this.room.storage);
                    if (range > 4 || range >= rangeToStorage) {
                        moveTarget = this.room.storage;
                    }
                }
            }

            if (moveTarget === null) {
                // This should only happen early on before there is a temporary or real storage.
                // The this.extensions array only holds extensions and spawns with available space.
                if (this.energy > 0 && this.room.spawns.length > 0) {
                    const spawn = this.getClosestByRange(this.room.spawns, (x) => x.energy < x.energyCapacity);
                    if (spawn !== null) {
                        moveTarget = spawn;
                    }
                }

                if (this.energy > 0 && this.room.extensions.length > 0) {
                    const extension = this.getClosestByRange(this.room.extensions, (x) => x.energy < x.energyCapacity);
                    if (extension !== null) {
                        moveTarget = extension;
                    }
                }
            }

            if (moveTarget === null) {
                if (this.energy > 0 && this.room.towers.length > 0) {
                    const tower = this.pos.findClosestByRange(this.room.towers);
                    if (tower !== null) {
                        moveTarget = tower;
                    }
                }
            }

            if (moveTarget === null) {
                if (this.room.storage) {
                    moveTarget = this.room.storage;
                }
            }
        }

        if (moveTarget !== null) {
            this.moveTo(moveTarget);
        }

        return true;
    }

    /**
     * Analyze the room and identify the appropriate number of haulers as well as their body.
     * 
     * @param room - An instance of a visible smart room.
     */
    static defineJob (room) {
        // Haulers need somewhere to find resources.
        // if (room.containers.length === 0 && !room.terminal) {
        //     return;
        // }

        // // Haulers need somewhere to deliver resources
        // if (room.isMine && !room.storage) {
        //     return;
        // }
        // return;

        // let distance = 0;
        // if (room.isMine) {
        //     for (let container of room.containers) {
        //         distance += room.storage.pos.getRangeTo(container);
        //     }
        //     if (room.terminal) {
        //         distance += room.storage.pos.getRangeTo(room.terminal);
        //     }
        // }
        // else {
        //     // Assume that the average distance from a container to the room border is 25 tiles.
        //     distance = room.containers.length * 25;
        // }

        // TODO: Use the number of containers and the size of sources instead of distance?
        // TODO: One container might not be used all the time (Minerals)

        // os.logger.info(room.name + ' distance: ' + distance);

        // let job = {};
        // job.number = 0;
        // job.body = [];

        // return job;
    }
}

module.exports = CreepHauler;
