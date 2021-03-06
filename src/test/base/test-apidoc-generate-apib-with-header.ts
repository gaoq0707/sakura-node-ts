// Copyright 2018 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {ApiDocContext} from "../../util/apidoccontext";
import * as fs from "fs";
import * as chai from "chai";
import {ApiDoc} from "../../base/apidoc";

class UserController {
  static async getUserInfo(): Promise<void> {}
}

describe("Test API doc to generate apib  string", () => {

  it("Test generating apib generate with header", () => {

    const doc: ApiDoc = {
      groupName: 'Monitor',
      descriptions: [
        {
          function: UserController.getUserInfo,
          description: '获得所有用户信息',
          detailDescription: '获得所有用户信息，以数组的形式返回',
          method: 'GET',
          uri: '/products?{pid}',
          queryParameters: [
            {
              key: 'pid',
              example: 5,
              type: 'number',
              description: '产品的 ID',
            },
          ],
          requestHeaders: {
            token: 'it-is-a-token',
          },
          responseBody: {
            data: {
              users: [
                {
                  uid: 1,
                  displayName: 'linxiaoyi',
                },
                {
                  uid: 2,
                  displayName: 'huangtaihu',
                },
              ],
            },
          },
        },
      ],
    };
    

    const expectString: string = fs.readFileSync("testdata/base/test-apidoc-generate-apib-with-header.txt", "utf8");
    const outputString = ApiDocContext.generateBlueprintDocument({ host: "https://api.gagogroup.cn/api", docs: [doc]});
    chai.expect(outputString).to.equal(expectString);
  });
});
