//bigQuery - bigQ - //domain/search?query
//base - like - Product.find()


class WhereClause {
    constructor(base, bigQ) {
        this.base = base;
        this.bigQ = bigQ;
    }


    search() {
        const searchword = this.bigQ.search ? {
            name: {
                $regex: this.bigQ.search,
                $options: "i"
            }
        } : {}
        this.base = this.base.find({ ...searchword })
        return this;
    }

    //limit - items to show on Page 1
    //skip - items to skip(shown already on page 1) and show next items on Page 2

    pager(resultperpage) {
        let currentPage = 1;
        if (this.bigQ.page) {
            currentPage = this.bigQ.page
        }

        const skipValue = resultperpage * (currentPage - 1)
        this.base = this.base.limit(currentPage).skip(skipValue)
        return this;
    }

    //filter method to remove redundant items and make query suitable to find items from database

    filter() {
        const copyQ = { ...this.bigQ }  //copying given bigQ and spreading it as an object

        //removing redundant key:value from this bigQ
        delete copyQ["search"];
        delete copyQ["limit"];
        delete copyQ["page"];

        //converting this fresh bigQ into string
        let stringOfCopyQ = JSON.stringify(copyQ);
        stringOfCopyQ = stringOfCopyQ.replace(/\b(gte|lte|gt|lt)\b/g, m => `$${m}`);

        //converting this string further into json
        const jsonOfCopyQ = JSON.parse(stringOfCopyQ);
        this.base = this.find(jsonOfCopyQ);
        return this;
    }
}


module.exports = WhereClause;