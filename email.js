const fs = require('fs')
const path = require('path')
const repoRoot = path.join(__dirname);
const nodemailer = require("nodemailer");
const zipper =require('zip-local')

//function definition
const sendReport = () => {
    const reportFilename = path.join(repoRoot, 'final.json')
    // const htmlReport = path.join(repoRoot, 'mochawesome-report')
    // const zipReport = path.join(repoRoot,"htmlReport.zip")
    const contents = JSON.parse(fs.readFileSync(reportFilename, 'utf8'))
    const totalTests=contents.stats.tests;
    const passedTests=contents.stats.passes;
    const failedTests=contents.stats.failures;
    const skippedTests=contents.stats.skipped;
    let failedTestsMessage="<br>";

    // zipper.sync.zip(htmlReport).compress().save("htmlReport.zip")

    for(let i=0;i<contents.stats.suites;i++)
    {
        let count=0;
        let flag=0;
        for(let j=0;j<contents.results[i].suites.length;j++)
        {
            
            if(contents.results[i].suites[j].failures.length>0 && count==0)
            {
                flag=1;
                failedTestsMessage=failedTestsMessage+"<b>"+"=> "+contents.results[i].file+"</b><ul>";
                count++;
            }
            for(let k=0;k<contents.results[i].suites[j].tests.length;k++)
            {
                if(contents.results[i].suites[j].tests[k].fail==true)
                {
                    failedTestsMessage=failedTestsMessage+"<li>"+contents.results[i].suites[j].tests[k].title+" : <b><i>"+contents.results[i].suites[j].title+"</i></b></li>";
                }
            }
        }
        if(flag==1)
        {
            failedTestsMessage=failedTestsMessage+"</ul>";
        } 
    }

    const message =`
    <h4>UI Automation Tests Report</h4>
    <ul>
        <li>Total Tests: ${totalTests}</li>
        <li>Passed Tests: ${passedTests}</li>
        <li>Failed Tests: ${failedTests}</li>
        <li>Skipped Tests: ${skippedTests}</li>
    </ul>
    <p>Failed Tests Details : ${failedTestsMessage}</p>
    `;

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "hrxreporter@gmail.com", 
          pass: "Bajaj@hrx@2021", 
        },
        tls: {
            rejectUnauthorized: false
        }
});

    let mailOptions = 
    {
        from: '"test-notification" hrxreporter@gmail.com',
        // to:"neeraj.rai2@bajajfinserv.in",
        to:"nabin.ghosh@bajajfinserv.in,neeraj.rai2@bajajfinserv.in,arun.iyer@bajajfinserv.in,chirag.patel3@bajajfinserv.in,anurag.vohra@bajajfinserv.in",
        //cc: "arun.iyer@bajajfinserv.in,chirag.patel3@bajajfinserv.in,anurag.vohra@bajajfinserv.in",
        subject: "HRx Web UI-Automation Report",
        text: "",
        html: message
        // attachments: [
        //     {
        //         filename: 'htmlReport.zip',
        //         path: zipReport,
        //     }
        // ]
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
}

//function call
sendReport();