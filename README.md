

<div align="center">
  <h1> typeorm-fixtures-test</h1>
  <h3>Manage your test fixtures the easy way</h3>
<br>
  
</div>



```yaml
  entity: Article
  items:
    article1:
      title: Typeorm-test-fixture is fast
      content: As fast as sql !
      user: '@user1'
      tags: ['@tag_fast', '@tag_maintainable']

    article2:
      title: Typeorm-test-fixture is maintainable
      content: Stop working with unreadable sql files
      user: '@user1'
      tags: ['@tag_cool', '@tag_maintainable']

```



typeorm-fixtures-test allows you to use yaml to manage your test fixtures.
it relies on [typeorm-fixtures-cli](https://github.com/RobinCK/typeorm-fixtures/).
It will help you manage easily data in readable yaml files (goodbye huge sql files with your unmaintainable foreign keys).  
You're about to say isn't it **slow** ? No it is nearly **as fast as sql**. The library generate cache at first test run,
so only the first test wil be slower. The cache will be invalidated as soon as you modify a yaml fixture, this way you don't have to worry about it.
For now, it works with PostgreSQL, MySQL and SQLite 





## Install

```
npm install typeorm-fixtures-test --save-dev
```

create a fixture.config.json file in project root directory 

```
{
  "path" : "PATH/TO_FIXTURE_DIR"
}

```


## How to use
### example with jest

```
beforeAll(async ()=>{
    // Init typeorm database connection
    await createConnection()
});

afterAll(async() => {
    // Close connection when tests are over.
    getConnection().close().then(() => {});
})


beforeEach(async ()=>{
    // Reset fixtures before each run
    await loadFixturesHelper('./fixtures/dataFixtures')
});


describe('GET /articles', function() {
    it('should return articles', function(done) {
        request(app)
            .get('/articles')
            .expect(200)
            .end(function(err, res) {
                expect(res.body).toHaveLength(2);
                done();
            });
    });
});
```


## Working examples
You can find (a boring) articles/tags/users example [here](#).  
If you're using nestjs [here is an example](#).


## Documentation
You want to know how to write yaml fixtures with all the cool stuff. Go to [typeorm-fixtures-cli](https://github.com/RobinCK/typeorm-fixtures/blob/master/README.md) readme file.  
The databases default configurations (postgres, mysql, sqlite) are available [here](doc/databaseConfiguration.md)
