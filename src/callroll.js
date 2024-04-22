import React from 'react';
import { List, Descriptions} from '@douyinfe/semi-ui';

function App(){
    const data = [{ name: '李真', points: 0 },{ name: '崔永恩', points: 0 },{ name: '张睿轩', points: 0 },{ name: '曾deep洲', points: 0 },{ name: '付子horn', points: 0 },{ name: 'van玉鹏（哥斯拉）', points: 0 },{ name: '高van', points: 0 },{ name: '比利海灵顿', points: 0 },{ name: '盛开', points: 0 }]

    const style = {
        border: '1px solid var(--semi-color-border)',
        backgroundColor: 'var(--semi-color-bg-2)',
        borderRadius: '3px',
        paddingLeft: '20px',
    };

    return (
        <div>
            <List
                grid={{
                    gutter: 12,
                    span: 6,
                }}
                dataSource={data}
                renderItem={item => (
                    <List.Item style={style}>
                        <div>
                            <h3 style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}>{item.name}</h3>
                            <Descriptions
                                align="center"
                                size="small"
                                row
                                data={[
                                    { key: '分数', value: item.points },
                                ]}
                            />

                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
}
export default App;