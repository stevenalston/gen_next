RESTful Routes - A mapping between HTTP Routes and CRUD
// THis is a convention, don't have to use

name            url             verb        desc
INDEX         /dogs             GET         Display a list of all items
NEW           /dogs/new         GET         Display a form to add item
CREATE        /dogs             POST        Create new item, redirect somewhere
SHOW          /dogs/:id         GET         Shows info on 1 specific item
EDIT          /dogs/:id/edit    GET         Show edit form for 1 item
UPDATE        /dogs/:id         PUT         Update a particular item, redirect somewhere
DELETE        /dogs/:id         DELETE      Destroy a particular item, redirect somewhere