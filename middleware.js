const handleCursorPagination = async (Model, query) => {
  let where = { ...query.payload.where };
  where = query.payload.cursor.id
    ? { ...where, id: { [Op.gt]: query.payload.cursor.id } }
    : where;

  const resp = await Model.findAndCountAll({
    where,
    limit: query.payload.take + 1,
  });
  const nextCursor = resp.rows[resp.rows.length - 1]?.id;
  const res = {
    pagination: {
      cursor: { id: nextCursor },
    },
    // Remove last item from data
    data: resp.rows.slice(0, resp.rows.length - 1),
  };
  return res;
};

const handleSkipTakePagination = async (Model, query) => {
  const resp = await Model.findAndCountAll({
    where: query.payload.where,
    limit: query.payload.take,
    offset: query.payload.skip,
  });
  const res = {
    pagination: {
      total: resp.count,
    },
    data: resp.rows,
  };
  return res;
};

const performOperation = async (Model, query) => {
  switch (query.operation) {
    case "create": {
      const result = await Model.create(query.payload.data);
      return result;
    }

    case "findOne": {
      const result = await Model.findOne({
        where: query.payload.where,
      });
      return result;
    }

    case "findMany": {
      let result;
      if (query.payload.cursor) {
        result = await handleCursorPagination(Model, query);
      } else {
        result = await handleSkipTakePagination(Model, query);
      }

      return result;
    }

    case "update": {
      await Model.update(query.payload.data, {
        where: query.payload.where,
      });
      const result = await Model.findOne({
        where: query.payload.where,
      });

      return result;
    }
    case "delete": {
      await Model.destroy({
        where: query.payload.where,
      });

      return { success: true };
    }
  }
};

function useDBSequelize(models) {
  return async function useDBSequelizeMiddleware(req, res) {
    const query = req.body;
    const Model = models[query.collection];
    const result = await performOperation(Model, query);
    res.send(result);
  };
}

module.exports = { useDBSequelize };
