const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

chai.use(sinonChai)
chai.should()

const rewire = require("rewire")
const formatter = rewire('../src/winston-datatdog-formatter')

describe("winston-datadog-formatter", () => {

    describe("maps alert types", () => {

        var mapper

        before(() => {
            mapper = formatter.__get__("getAlertType")
        })

        it("defaults to info", () => {
            var v1 = mapper("")
            var v2 = mapper("info")

            v1.should.deep.equal("info")
            v2.should.deep.equal("info")
        })

        it("maps levels", () => {
            var v1 = mapper("error")
            var v2 = mapper("warn")

            v1.should.deep.equal("error")
            v2.should.deep.equal("warning")
        })

    })

    describe("formats a basic message", () => {

        var fmt

        before(() => {
            fmt = formatter.__get__("formatBasicMessage")
        })

        it("formats the message", () => {
            msg = fmt({
                level: "warn",
                message: "foo bar"
            })

            msg.timestamp.should.be.a("String")
            msg.level.should.deep.equal("warning")
            msg.message.should.deep.equal("foo bar")
        })
    })

    describe("handles additional properties", () => {

        var parser

        before(() => {
            parser = formatter.__get__("parseAdditionalProperties")
        })

        it("parses no additional properties", () => {
            var props = parser();
            props.should.deep.equal({});
        })

        it("parses additional properties", () => {
            var props = parser(["foo:bar", "hello:world"]);
            props.should.deep.equal({foo: "bar", hello: "world"});
        })
            
    })

})