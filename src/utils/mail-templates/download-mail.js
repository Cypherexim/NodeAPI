const template  = `<table width="600" align="center" style="width:600px; 
font-family: 'sf_ui_displaylight', sans-serif" border="0" cellspacing="6" cellpadding="4">
        <tbody>
            <tr >
                <th align="left" valign="middle" style="padding: 15px 22px;" scope="col"><a href="https://www.Cypher.com/"><img
                            src="https://cypherexim-files.s3.amazonaws.com/cypher_logo.png"
                            width="180" height="" alt="" /></a></th>
                <th align="right" valign="middle" style="padding: 15px 0px; " scope="col"><a
                        href="https://www.Cypher.com/"><img
                            src="https://Cypher-email-template.s3.ap-south-1.amazonaws.com/logo/ministry.png"
                            width="160" height="" alt="" /></a></th>
                <th align="right" valign="middle" style="padding: 15px 22px 15px 15px;" scope="col"><a href="https://www.Cypher.com/"><img
                            src="https://Cypher-email-template.s3.ap-south-1.amazonaws.com/logo/aicte-2.png" width="50"
                            height="" alt="" /></a></th>
            </tr>
        </tbody>
    </table>
    
    


    <table width="600" align="center" style="width:600px;
font-family: 'sf_ui_displaylight', sans-serif" border="0" align="center">
        <tbody>
            <tr>
                <td style=" padding: 14px;">
                    <h4
                        style="color:#000; font-size:14px !important; line-height:22px !important;-webkit-text-size-adjust:100%; font-family: 'Roboto', sans-serif; font-weight:600">
                        Hello {{name}},</h4>
 <p style="color:#4CBFA6; font-size:14px !important; line-height:22px !important;-webkit-text-size-adjust:100%; font-family: 'Roboto', sans-serif; font-weight:600;">
                        Greetings from Cypher!
                    </p>
                    <p
                        style="color:#000; font-size:14px !important; line-height:22px !important;-webkit-text-size-adjust:100%; font-family: 'Roboto', sans-serif; font-weight:300;">
                        Your password has been successfully reset. </p>
                        
                        <p
                        style="color:#000; font-size:14px !important; line-height:22px !important;-webkit-text-size-adjust:100%; font-family: 'Roboto', sans-serif; font-weight:300;">
                        Please use the following username/password combination to access the Cypher portal. </p>                   
<table style=" color:#000; font-size:14px;font-size:14px !important; ;line-height:16px !important; border: 2px dashed #000; border-radius: 8px; width: 70%;min-width: 350px;">

    <tr>
      <td style="padding: 20px; font-weight: bold;">Username</td>
	  <td><b>:</b></td>
      <td >{{username}}</td>
    </tr>
	<tr>
      <td style="padding: 20px; font-weight: bold;">Password</td>
	  <td><b>:</b></td>
      <td >{{password}}</td>
    </tr>
</table>
                    
<br>
                    <a href="{{domainurl}}" type="submit"
                        style="background-color:#4CBFA6;color:#fff;border:1px solid #4CBFA6!important;height: 35px;width: 70px;line-height:36px;padding:0 16px;border-radius:4px;cursor: pointer;text-decoration: none;display: block;text-align: center;font-family: 'Roboto', sans-serif;">Login</a>



                    <p
                        style="color:#000; font-size:14px !important; line-height:22px !important;-webkit-text-size-adjust:100%; font-family: 'Roboto', sans-serif; font-weight:300;">
                        In
                        case of any queries, you may also write to us at <span
                            style="color:blue; font-family: 'Roboto', sans-serif; font-weight:300;">info@Cypher.com</span>
                    </p>
                    <p
                        style="color:#000; font-size:14px !important; line-height:22px !important;-webkit-text-size-adjust:100%; font-family: 'Roboto', sans-serif; font-weight:600;">
                        Best
                        Regards,</p>
                        <p style="color:#4CBFA6;; font-size:14px !important; line-height:22px !important;-webkit-text-size-adjust:100%; font-family: 'Roboto', sans-serif; font-weight:600;">Cypher Team</p>
                </td>
            </tr>
        </tbody>
    </table>

    
    <table width="600px" style="width:600px;height:100% ;border-collapse: collapse;
font-family: 'sf_ui_displaylight', sans-serif" border="0" align="center">
        <tbody>
            <tr>
                <td>
                    <div align="left" valign="top" style="text-align: center; font-weight: bold;padding: 5px 30px;"
                        scope="col">
                        <h3
                            style="color:#4CBFA6;margin-bottom: 0;margin-top: 0;font-size: 12px;text-align:center;font-weight:normal">
                            <a style="text-decoration: none;" href="https://www.Cypher.com" target="_blank"><span
                                style="color: #4CBFA6;font-weight: 600;">www.Cypherexim.com</span></a> |
                            <span
                                    style="color: #4CBFA6;font-weight: 600;">Cypher™️</span> 
                        </h3>
                    </div>
                </td>

            </tr>
        </tbody>
    </table>`;

    module.exports = {template};