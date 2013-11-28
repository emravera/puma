test( "EXAMPLE: equal test", function() {
    ok( 1 == "1", "Passed!" );
});

test("number constant test", function() {
    var result = evalPuma("1");
    ok( result.success && 1 === result.value, "Passed!" );
});

test("string constant test", function() {
    var result = evalPuma("\"Hello\"");
    ok( result.success && "Hello" === result.value, "Passed!" );
});

test("function sum test", function() {
    var result = evalPuma(1+1);
    ok( result.success && 2 === result.value, "Passed!" );
});