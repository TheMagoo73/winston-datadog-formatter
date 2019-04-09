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

    describe("formatting DataDog messages", () => {

        var revert

        before(() => {
            revert = formatter.__set__({
                _additionalProperties: {foo: "bar", hello: "world"},
                getTimeStamp: () => "123"
            })
        })

        after(() => {
            revert()
        })

        it("Formats a basic message correctly", () => {
            var datadogMsg = formatter.__get__("datadogMsgFromWinstonMsg")({level: "warn", message: "foo bar"})
            datadogMsg.should.deep.equal('{"timestamp":"123","level":"warning","message":"foo bar","foo":"bar","hello":"world"}\n')
        })

        it("Add a stack trace and id if required", () => {
            var datadogMsg = formatter.__get__("datadogMsgFromWinstonMsg")({id: "abc", level: "warn", message: "foo bar", stack: "a stack"})
            datadogMsg.should.deep.equal('{"timestamp":"123","level":"warning","message":"foo bar","stackTrace":"a stack","errorId":"abc",foo":"bar","hello":"world"}\n')
        })
    })

})